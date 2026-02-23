import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Persistent state for authentication
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // User profile structure
  public type UserProfile = {
    name : Text;
    gamesPlayed : Nat;
    totalScore : Nat;
    isPro : Bool;
  };

  // Payment tier definitions
  public type PaymentTier = {
    #free;
    #pro;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Payment tier tracking
  func determineTier(profile : UserProfile) : PaymentTier {
    if (profile.isPro) { #pro } else { #free };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Get existing profile to preserve isPro status
    let existingProfile = userProfiles.get(caller);
    let currentProStatus = switch (existingProfile) {
      case (null) { false };
      case (?p) { p.isPro };
    };

    // Owner (admin) automatically gets Pro subscription
    let finalProStatus = if (AccessControl.isAdmin(accessControlState, caller)) {
      true;
    } else {
      // Regular users cannot modify their Pro status through this function
      // Pro status can only be granted via payment (grantProSubscription function)
      currentProStatus;
    };

    userProfiles.add(
      caller,
      {
        name = profile.name;
        gamesPlayed = profile.gamesPlayed;
        totalScore = profile.totalScore;
        isPro = finalProStatus;
      },
    );
  };

  public query func isCallerPro({ caller } : { caller : Principal }) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check subscription status");
    };
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.isPro };
    };
  };

  // Internal function to grant Pro subscription after payment verification
  // This should only be called after successful Stripe payment verification
  func grantProSubscription(user : Principal) {
    let existingProfile = userProfiles.get(user);
    switch (existingProfile) {
      case (null) {
        // Create new profile with Pro status
        userProfiles.add(
          user,
          {
            name = "";
            gamesPlayed = 0;
            totalScore = 0;
            isPro = true;
          },
        );
      };
      case (?oldProfile) {
        // Update existing profile to Pro
        userProfiles.add(
          user,
          {
            oldProfile with isPro = true;
          },
        );
      };
    };
  };

  // Function to complete Pro subscription after payment
  // Verifies payment and grants Pro status
  public shared ({ caller }) func completeProSubscription(sessionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete subscriptions");
    };

    let status = await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);

    switch (status) {
      case (#completed { userPrincipal }) {
        switch (userPrincipal) {
          case (?principal) {
            let principalType = Principal.fromText(principal);
            if (not Principal.equal(principalType, caller)) {
              Runtime.trap("Unauthorized: Session does not belong to caller");
            };
          };
          case (null) {
            Runtime.trap("Unexpected: No customer found for completed transaction");
          };
        };
      };
      case (#failed { error }) {
        Runtime.trap("Payment failed: " # error);
      };
    };

    // Grant Pro subscription
    grantProSubscription(caller);
  };

  // Game management structure
  public type Game = {
    id : Text;
    title : Text;
    description : Text;
    creator : Principal;
    gameCode : Text;
    creationTime : Int;
    lastModified : Int;
  };

  let games = Map.empty<Text, Game>();

  public query func getGame(id : Text) : async ?Game {
    games.get(id);
  };

  public query func getAllGames() : async [Game] {
    games.values().toArray();
  };

  public shared ({ caller }) func createGame(title : Text, description : Text, gameCode : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create games");
    };

    let id = title;
    let game : Game = {
      id;
      title;
      description;
      creator = caller;
      gameCode;
      creationTime = 0;
      lastModified = 0;
    };

    games.add(id, game);
    id;
  };

  public shared ({ caller }) func updateGame(id : Text, title : ?Text, description : ?Text, gameCode : ?Text) : async () {
    switch (games.get(id)) {
      case (?game) {
        if (not Principal.equal(caller, game.creator)) {
          Runtime.trap("Unauthorized: Only the game creator can update this game");
        };

        let updatedGame = {
          game with
          title = switch (title) {
            case (?t) { t };
            case (null) { game.title };
          };
          description = switch (description) {
            case (?d) { d };
            case (null) { game.description };
          };
          gameCode = switch (gameCode) {
            case (?c) { c };
            case (null) { game.gameCode };
          };
          lastModified = 0;
        };

        games.add(id, updatedGame);
      };
      case (null) { Runtime.trap("Game not found") };
    };
  };

  public shared ({ caller }) func deleteGame(id : Text) : async () {
    switch (games.get(id)) {
      case (?game) {
        if (not (Principal.equal(caller, game.creator) or AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only the creator or admins can delete this game");
        };
        games.remove(id);
      };
      case (null) { Runtime.trap("Game not found") };
    };
  };

  public query ({ caller }) func getCreators() : async [Principal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all creators");
    };

    let creatorSet = Map.empty<Principal, Bool>();
    for (game in games.values()) {
      creatorSet.add(game.creator, true);
    };
    creatorSet.keys().toArray();
  };

  public query func getCreatorGameCount(creator : Principal) : async Nat {
    var count = 0;
    for (game in games.values()) {
      if (Principal.equal(game.creator, creator)) { count += 1 };
    };
    count;
  };

  public query ({ caller }) func getCallerGameCount() : async Nat {
    var count = 0;
    for (game in games.values()) {
      if (Principal.equal(game.creator, caller)) { count += 1 };
    };
    count;
  };

  // Stripe integration for payment handling
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set configuration");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
