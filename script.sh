ASSETSFOLDER=assets/timeline

for mediaFile in `ls $ASSETSFOLDER | grep .mp4`; do
    # retirar extensao do nome do arquivo e adquirir nome das pastas
    FILENAME=$(echo $mediaFile | sed -n 's/_/-/gp' | sed -n 's/-1080.mp4//gp')
    FOLDER_NAME=$(echo $mediaFile | sed -n 's/_.*.mp4//p')
    FILE_PATH=$ASSETSFOLDER/$mediaFile
    FOLDER_PATH=$ASSETSFOLDER/$FOLDER_NAME
    mkdir -p $FOLDER_PATH

    OUTPUT=$ASSETSFOLDER/$FOLDER_NAME/$FILENAME
    DURATION=$(ffprobe -i $FILE_PATH -show_format -v -8 | sed -n 's/duration=//p')

    OUTPUT240=${OUTPUT}-${DURATION}-240
    OUTPUT360=${OUTPUT}-${DURATION}-360
    OUTPUT720=${OUTPUT}-${DURATION}-720

    echo rendering $FILENAME 'in' 720p
    ffmpeg -y -i $FILE_PATH \
        -c:a aac -ac 2 \
        -vcodec h264 -acodec aac \
        -ab 128k \
        -movflags frag_keyframe+empty_moov+default_base_moof \
        -b:v 1500k \
        -maxrate 1500k \
        -bufsize 1000k \
        -vf "scale=-1:720" \
        -v quiet \
        $OUTPUT720.mp4
    
    
    echo rendering $FILENAME 'in' 360p
    ffmpeg -y -i $FILE_PATH \
        -c:a aac -ac 2 \
        -vcodec h264 -acodec aac \
        -ab 128k \
        -movflags frag_keyframe+empty_moov+default_base_moof \
        -b:v 400k \
        -maxrate 400k \
        -bufsize 400k \
        -vf "scale=-1:360" \
        -v quiet \
        $OUTPUT360.mp4

    echo rendering $FILENAME 'in' 240p
    ffmpeg -y -i $FILE_PATH \
        -c:a aac -ac 2 \
        -vcodec h264 -acodec aac \
        -ab 128k \
        -movflags frag_keyframe+empty_moov+default_base_moof \
        -b:v 300k \
        -maxrate 300k \
        -bufsize 300k \
        -vf "scale=426:240" \
        -v quiet \
        $OUTPUT240.mp4
        
done