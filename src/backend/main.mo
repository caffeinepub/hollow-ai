import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
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

  type GameMetadata = {
    title : Text;
    category : Text;
    description : Text;
    author : Principal;
    creationTime : Int;
    highScore : Nat;
  };

  let games = Map.empty<Text, GameMetadata>();

  // Predefined Game Templates (as text blobs)
  let templates = Map.fromIter(
    [
      ("snake", "<html>...Snake Game Code...</html>"),
      ("pong", "<html>...Pong Game Code...</html>"),
      ("tictactoe", "<html>...Tic-Tac-Toe Game Code...</html>"),
      ("memory", "<html>...Memory Match Game Code...</html>"),
      ("whackamole", "<html>...Whack-a-Mole Game Code...</html>"),
      ("colormatch", "<html>...Color Match Game Code...</html>"),
    ].values()
  );

  let categories = List.empty<Text>();

  public query func getGame(id : Text) : async ?GameMetadata {
    games.get(id);
  };

  public query func getAllGames() : async [GameMetadata] {
    games.values().toArray();
  };

  public query func getCategories() : async [Text] {
    categories.toArray();
  };

  public query func searchGamesByCategory(category : Text) : async [GameMetadata] {
    let filtered = List.empty<GameMetadata>();
    for (game in games.values()) {
      if (Text.equal(game.category, category)) {
        filtered.add(game);
      };
    };
    filtered.toArray();
  };

  public query ({ caller }) func searchGamesByAuthor(author : Principal) : async [GameMetadata] {
    let filtered = List.empty<GameMetadata>();
    for (game in games.values()) {
      if (Principal.equal(game.author, author)) {
        filtered.add(game);
      };
    };
    filtered.toArray();
  };

  public query func getHighScore(id : Text) : async Nat {
    switch (games.get(id)) {
      case (?game) { game.highScore };
      case (null) { Runtime.trap("Game not found") };
    };
  };

  public query func getTemplate(name : Text) : async Text {
    switch (templates.get(name)) {
      case (?template) { template };
      case (null) {
        Runtime.trap("Template not found");
      };
    };
  };

  public query func listTemplateNames() : async [Text] {
    templates.keys().toArray();
  };

  public shared ({ caller }) func updateHighScore(id : Text, score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update scores");
    };

    switch (games.get(id)) {
      case (?game) {
        if (score > game.highScore) {
          let updatedGame = { game with highScore = score };
          games.add(id, updatedGame);
        };
      };
      case (null) {
        Runtime.trap("Game not found");
      };
    };
  };

  public shared ({ caller }) func createGame(title : Text, category : Text, description : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create games");
    };

    let id = title; // Use title + timestamp as ID
    let metadata : GameMetadata = {
      title;
      category;
      description;
      author = caller;
      creationTime = 0;
      highScore = 0;
    };

    games.add(id, metadata);

    // Add new category if it doesn't exist
    if (not categories.any(func(c) { Text.equal(c, category) })) {
      categories.add(category);
    };

    id;
  };

  public shared ({ caller }) func deleteGame(id : Text) : async () {
    switch (games.get(id)) {
      case (?game) {
        // Allow deletion if caller is the author or an admin
        if (not (Principal.equal(caller, game.author) or AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only the game author or admins can delete this game");
        };
        games.remove(id);
      };
      case (null) {
        Runtime.trap("Game not found");
      };
    };
  };

  public query ({ caller }) func getAuthors() : async [Principal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all authors");
    };

    let authorSet = Map.empty<Principal, Bool>();
    for (game in games.values()) {
      authorSet.add(game.author, true);
    };
    authorSet.keys().toArray();
  };
};
