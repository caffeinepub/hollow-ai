import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat64 "mo:core/Nat64";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";

module {
  type UserId = Principal;
  type MessageId = Text;
  type SessionId = Text;
  type ArtworkId = Text;
  type MusicId = Text;
  type GameId = Text;

  type Message = {
    id : MessageId;
    content : Text;
    timestamp : Nat64;
  };

  type Session = {
    id : SessionId;
    messages : List.List<Message>;
    lastActive : Nat64;
  };

  type GameMetadata = {
    id : GameId;
    title : Text;
    description : Text;
    thumbnail : Storage.ExternalBlob;
    category : Text;
    playable : Bool;
  };

  type UserData = {
    id : UserId;
    sessions : Map.Map<SessionId, Session>;
  };

  type OldActor = {
    users : Map.Map<UserId, UserData>;
    artworks : Map.Map<ArtworkId, Storage.ExternalBlob>;
    music : Map.Map<MusicId, Storage.ExternalBlob>;
    games : Map.Map<GameId, GameMetadata>;
  };

  type Word = {
    word : Text;
    definition : Text;
  };

  type NewActor = {
    wordMap : Map.Map<Text, Word>;
  };

  public func run(_old : OldActor) : NewActor {
    let newWordMap = Map.empty<Text, Word>();
    { wordMap = newWordMap };
  };
};
