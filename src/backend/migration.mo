import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Original user profile type
  type OldUserProfile = {
    name : Text;
    gamesPlayed : Nat;
    totalScore : Nat;
    hasProSubscription : Bool;
  };

  // Original actor type
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    // other fields from backend/main.mo can be added here if needed
  };

  // New user profile type
  type NewUserProfile = {
    name : Text;
    gamesPlayed : Nat;
    totalScore : Nat;
    isPro : Bool;
  };

  // New actor type
  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    // same here
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_ , oldProfile) {
        {
          oldProfile with
          isPro = oldProfile.hasProSubscription;
        };
      }
    );
    {
      old with
      userProfiles = newUserProfiles;
    };
  };
};
