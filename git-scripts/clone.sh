if [ -z "$KALS_BRANCH" ]; then KALS_BRANCH=voc4fun-server/master; fi
if [ -z "$KALS_PATH" ]; then KALS_PATH=/opt/lampp/htdocs/voc4fun-client; fi
if [ -z "$KALS_DIR" ]; then KALS_DIR=/opt/lampp/htdocs; fi

#echo $KALS_DIR

#cd $KALS_DIR
git clone git://github.com/pulipulichen/voc4fun-client.git "$KALS_PATH"
git reset --hard origin/master