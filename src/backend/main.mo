import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Migration "migration";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Word = {
    word : Text;
    definition : Text;
  };

  let wordMap = Map.empty<Text, Word>();

  public shared ({ caller }) func addWord(word : Text, definition : Text) : async () {
    switch (wordMap.get(word)) {
      case (null) {
        let newWord : Word = {
          word;
          definition;
        };
        wordMap.add(word, newWord);
      };
      case (?_) { Runtime.trap("Word " # word # " already exists!") };
    };
  };

  public query ({ caller }) func getWord(word : Text) : async Word {
    switch (wordMap.get(word)) {
      case (null) { Runtime.trap("Word does not exist : " # word) };
      case (?entry) { entry };
    };
  };

  public query ({ caller }) func listWords() : async [Text] {
    wordMap.keys().toArray();
  };

  public query ({ caller }) func getDefinition(word : Text) : async Text {
    switch (wordMap.get(word)) {
      case (null) { Runtime.trap("Word does not exist : " # word) };
      case (?entry) { entry.definition };
    };
  };
};
