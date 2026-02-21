import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    gamesPlayed : Nat;
    totalScore : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

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
    userProfiles.add(caller, profile);
  };

  // Extended GameType
  public type Game = {
    id : Text;
    title : Text;
    description : Text;
    creator : Principal;
    gameCode : Text;
    creationTime : Int;
    lastModified : Int;
  };

  // Extended Game storage implementation
  let games = Map.empty<Text, Game>();

  // No more templates or categories - categories are handled in frontend now
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

    // Removed invalid slice usage - just use title for id
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
          title = switch (title) { case (?t) { t }; case (null) { game.title } };
          description = switch (description) { case (?d) { d }; case (null) { game.description } };
          gameCode = switch (gameCode) { case (?c) { c }; case (null) { game.gameCode } };
          lastModified = 0;
        };

        games.add(id, updatedGame);
      };
      case (null) {
        Runtime.trap("Game not found");
      };
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
      case (null) {
        Runtime.trap("Game not found");
      };
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
      if (Principal.equal(game.creator, creator)) {
        count += 1;
      };
    };
    count;
  };

  public query ({ caller }) func getCallerGameCount() : async Nat {
    var count = 0;
    for (game in games.values()) {
      if (Principal.equal(game.creator, caller)) {
        count += 1;
      };
    };
    count;
  };
};
