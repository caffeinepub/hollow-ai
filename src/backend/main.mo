import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat64 "mo:core/Nat64";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type UserId = Principal;
  type MessageId = Text;
  type SessionId = Text;

  type Message = {
    id : MessageId;
    content : Text;
    timestamp : Nat64;
  };

  module Message {
    public func compare(message1 : Message, message2 : Message) : Order.Order {
      Text.compare(message1.id, message2.id);
    };

    public func compareByTimestamp(message1 : Message, message2 : Message) : Order.Order {
      Nat64.compare(message1.timestamp, message2.timestamp);
    };
  };

  type Session = {
    id : SessionId;
    messages : List.List<Message>;
    lastActive : Nat64;
  };

  type SessionView = {
    id : SessionId;
    messages : [Message];
    lastActive : Nat64;
  };

  module Session {
    public func compare(session1 : Session, session2 : Session) : Order.Order {
      Text.compare(session1.id, session2.id);
    };

    public func compareByLastActive(session1 : Session, session2 : Session) : Order.Order {
      Nat64.compare(session1.lastActive, session2.lastActive);
    };
  };

  type UserData = {
    id : UserId;
    sessions : Map.Map<SessionId, Session>;
  };

  let users = Map.empty<UserId, UserData>();

  func toSessionView(session : Session) : SessionView {
    {
      id = session.id;
      messages = session.messages.toArray();
      lastActive = session.lastActive;
    };
  };

  public shared ({ caller }) func registerUser() : async () {
    if (users.containsKey(caller)) { Runtime.trap("This user is already registered.") };
    let userData : UserData = {
      id = caller;
      sessions = Map.empty<SessionId, Session>();
    };
    users.add(caller, userData);
  };

  public query ({ caller }) func getUserSessions() : async [SessionView] {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?userData) {
        userData.sessions.values().toArray().sort(Session.compareByLastActive).map(toSessionView);
      };
    };
  };

  public query ({ caller }) func getSession(sessionId : SessionId) : async SessionView {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?userData) {
        switch (userData.sessions.get(sessionId)) {
          case (null) { Runtime.trap("Session does not exist") };
          case (?session) { toSessionView(session) };
        };
      };
    };
  };

  public shared ({ caller }) func addMessageToSession(sessionId : SessionId, message : Message) : async () {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?userData) {
        switch (userData.sessions.get(sessionId)) {
          case (null) { Runtime.trap("Session does not exist") };
          case (?session) {
            session.messages.add(message);
            let updatedSession : Session = {
              id = session.id;
              messages = session.messages;
              lastActive = Nat64.fromIntWrap(Time.now());
            };
            userData.sessions.add(sessionId, updatedSession);
          };
        };
      };
    };
  };

  public shared ({ caller }) func solveMathProblem(expression : Text) : async Text {
    // Placeholder: Actual math evaluation happens in the TypeScript client
    expression;
  };
};
