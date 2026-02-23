import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
    gamesPlayed : Nat;
    totalScore : Nat;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    games : Map.Map<Text, { id : Text; title : Text; description : Text; creator : Principal; gameCode : Text; creationTime : Int; lastModified : Int }>;
  };

  type NewUserProfile = {
    name : Text;
    gamesPlayed : Nat;
    totalScore : Nat;
    hasProSubscription : Bool;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    games : Map.Map<Text, { id : Text; title : Text; description : Text; creator : Principal; gameCode : Text; creationTime : Int; lastModified : Int }>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          oldProfile with
          hasProSubscription = false;
        };
      }
    );
    {
      old with
      userProfiles = newUserProfiles;
    };
  };
};
