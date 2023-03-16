INCLUDES="liblbfgs/lib/lbfgs.c \
crfsuite/lib/crf/src/crf1d_context.c \
crfsuite/lib/crf/src/crf1d_encode.c \
crfsuite/lib/crf/src/crf1d_feature.c \
crfsuite/lib/crf/src/crf1d_model.c \
crfsuite/lib/crf/src/crf1d_tag.c \
crfsuite/lib/crf/src/crfsuite.c \
crfsuite/lib/crf/src/crfsuite_train.c \
crfsuite/lib/crf/src/dataset.c \
crfsuite/lib/crf/src/dictionary.c \
crfsuite/lib/crf/src/holdout.c \
crfsuite/lib/crf/src/logging.c \
crfsuite/lib/crf/src/params.c \
crfsuite/lib/crf/src/quark.c \
crfsuite/lib/crf/src/rumavl.c \
crfsuite/lib/crf/src/train_arow.c \
crfsuite/lib/crf/src/train_averaged_perceptron.c \
crfsuite/lib/crf/src/train_l2sgd.c \
crfsuite/lib/crf/src/train_lbfgs.c \
crfsuite/lib/crf/src/train_passive_aggressive.c \
crfsuite/lib/cqdb/src/cqdb.c \
crfsuite/lib/cqdb/src/lookup3.c \
-I liblbfgs/include \
-I crfsuite/include \
-I crfsuite/lib/cqdb/include \
main.cc"

rm -rf build/* && emcc $INCLUDES --bind -O3 --memory-init-file 0 -g0 \
  -s WASM=1 \
  -s WASM_ASYNC_COMPILATION=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s DISABLE_EXCEPTION_CATCHING=1 \
  -s AGGRESSIVE_VARIABLE_ELIMINATION=1 \
  -s NO_EXIT_RUNTIME=1 \
  -s ASSERTIONS=0 \
  -s ERROR_ON_UNDEFINED_SYMBOLS=1 \
  -s NODEJS_CATCH_EXIT=0 \
	-s DYNAMIC_EXECUTION=0 \
	-s TEXTDECODER=0 \
	-s ENVIRONMENT='web' \
	-s FETCH_SUPPORT_INDEXEDDB=0 \
  -s EXPORT_ES6=1 \
	-s USE_ES6_IMPORT_META=0 \
  -s EXPORTED_RUNTIME_METHODS=['FS'] \
	-s EXPORT_NAME="crfsuite" \
  -s MODULARIZE=1 \
	-s INCOMING_MODULE_JS_API=['instantiateWasm']\
  -o build/crfsuite.mjs

# -s NODERAWFS=1 \