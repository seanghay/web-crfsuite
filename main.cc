#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <iostream>
#include <memory>

#include "crfsuite.hpp"
#include "crfsuite_api.hpp"

using namespace emscripten;

class TrainerWrapper {
 public:
  TrainerWrapper() {
    this->trainer = new CRFSuite::Trainer();
    this->trainer->select("lbfgs", "crf1d");
  }

  ~TrainerWrapper() {
    if (this->trainer) {
      delete this->trainer;
    }
  }

  emscripten::val Params() {
    return emscripten::val::array(this->trainer->params());
  }

  emscripten::val GetPrams() {
    CRFSuite::StringList params = this->trainer->params();
    emscripten::val result = emscripten::val::object();

    for (size_t i = 0; i < params.size(); i++) {
      std::string& key = params[i];
      result.set(key, this->trainer->get(key));
    }

    return result;
  }

  void SetParams(const emscripten::val& options) {
    emscripten::val keys =
        emscripten::val::global("Object").call<emscripten::val>("keys",
                                                                options);
    size_t key_count = keys["length"].as<size_t>();
    for (size_t i = 0; i < key_count; i++) {
      std::string key = keys[i].as<std::string>();
      std::string value = options[key].as<std::string>();
      this->trainer->set(key, value);
    }
  }

  void Set(const std::string& key, const std::string& value) {
    this->trainer->set(key, value);
  }

  std::string Get(const std::string& key) { return this->trainer->get(key); }

  void Append(const emscripten::val& xseq, const emscripten::val& yseq) {
    if (!xseq.isArray()) {
      message("xseq is not an array");
      return;
    }

    if (!yseq.isArray()) {
      message("yseq is not an array");
      return;
    }

    size_t xseq_count = xseq["length"].as<size_t>();
    size_t yseq_count = yseq["length"].as<size_t>();

    if (xseq_count != yseq_count) {
      message("xseq and yseq must be of same size");
      return;
    }

    CRFSuite::ItemSequence items;
    CRFSuite::StringList labels;

    for (size_t i = 0; i < xseq_count; i++) {
      if (!xseq[i].isArray()) {
        message("xseq at position " + std::to_string(i) + " is not an array");
        continue;
      }

      CRFSuite::Item item;
      item.clear();

      size_t size = xseq[i]["length"].as<size_t>();
      for (size_t j = 0; j < size; j++) {
        if (!xseq[i][j].isString()) {
          message("xseq at position " + std::to_string(i) + ":" +
                  std::to_string(j) + " is not a string");
          continue;
        }
        std::string element = xseq[i][j].as<std::string>();
        item.push_back(CRFSuite::Attribute(element));
      }

      items.push_back(item);
    }

    for (size_t i = 0; i < yseq_count; i++) {
      if (!yseq[i].isString()) {
        message("yseq at positiion " + std::to_string(i) + " is not a strng");
        continue;
      }

      std::string element = yseq[i].as<std::string>();
      labels.push_back(element);
    }

    if (items.size() != labels.size()) {
      message("items and labels size mismatched, so no items were appended!");
      return;
    }

    this->trainer->append(items, labels, 0);
  }

  emscripten::val Train(const std::string& model) {
    int32_t status = this->trainer->train(model, -1);
    return emscripten::val(status);
  }

  std::string Help(const std::string& key) { return this->trainer->help(key); }

  void Clear() { this->trainer->clear(); }

 private:
  CRFSuite::Trainer* trainer;
  static void message(const std::string& msg) { std::cout << msg << std::endl; }
};

class TaggerWrapper {
 public:
  TaggerWrapper() { this->tagger = new CRFSuite::Tagger(); }
  ~TaggerWrapper() {
    if (this->tagger) {
      delete this->tagger;
    }
  }

  bool Open(const std::string& model) { return this->tagger->open(model); }
  void Close() { this->tagger->close(); }

  emscripten::val Tag(const emscripten::val& xseq) {
    if (!xseq.isArray()) {
      message("xseq is not an array");
      return emscripten::val::array();
    }

    size_t length = xseq["length"].as<size_t>();

    CRFSuite::ItemSequence items;

    for (size_t i = 0; i < length; ++i) {
      if (!xseq[i].isArray()) {
        message("xseq at position " + std::to_string(i) + " is not an array");
        return emscripten::val::array();
      }

      size_t sub_length = xseq[i]["length"].as<size_t>();

      CRFSuite::Item item;
      item.empty();

      for (size_t j = 0; j < sub_length; ++j) {
        emscripten::val element = xseq[i][j];
        if (!element.isString()) {
          message("xseq at position " + std::to_string(i) + ":" +
                  std::to_string(j) + " is not a string");
          continue;
        }

        std::string str = element.as<std::string>();
        item.push_back(CRFSuite::Attribute(str));
      }

      items.push_back(item);
    }

    CRFSuite::StringList labels = this->tagger->tag(items);
    return emscripten::val::array(labels);
  }

  emscripten::val GetLabels() {
    CRFSuite::StringList labels = this->tagger->labels();
    return emscripten::val::array(labels);
  }

 private:
  CRFSuite::Tagger* tagger;
  static void message(const std::string& msg) { std::cout << msg << std::endl; }
};

EMSCRIPTEN_BINDINGS(my_module) {
  class_<TaggerWrapper>("Tagger")
      .smart_ptr_constructor("Tagger", &std::make_shared<TaggerWrapper>)
      .function("open", &TaggerWrapper::Open)
      .function("close", &TaggerWrapper::Close)
      .function("labels", &TaggerWrapper::GetLabels)
      .function("tag", &TaggerWrapper::Tag);

  class_<TrainerWrapper>("Trainer")
      .smart_ptr_constructor("Trainer", &std::make_shared<TrainerWrapper>)
      .function("setParams", &TrainerWrapper::SetParams)
      .function("getParams", &TrainerWrapper::GetPrams)
      .function("params", &TrainerWrapper::Params)
      .function("get", &TrainerWrapper::Get)
      .function("set", &TrainerWrapper::Set)
      .function("append", &TrainerWrapper::Append)
      .function("train", &TrainerWrapper::Train)
      .function("help", &TrainerWrapper::Help)
      .function("clear", &TrainerWrapper::Clear);
}