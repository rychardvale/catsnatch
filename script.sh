MATERIALS_FOLDER=C:/Users/Rychard/Desktop/psd/catsnatch/rendered
ASSETS_FOLDER=./assets/timeline

for mediaFile in `ls $MATERIALS_FOLDER`; do
    RAW_NAME=$(echo $mediaFile | sed -n 's/-1080.mp4//p')
    NEW_FOLDER_NAME=$(echo $mediaFile | sed -n 's/-.*.mp4//p')
    INPUT=$MATERIALS_FOLDER/$mediaFile

    mkdir -p $ASSETS_FOLDER/$NEW_FOLDER_NAME

    DURATION=$(ffprobe -show_format -v quiet $INPUT | sed -n 's/duration=//p')

    OUTPUT_720=$ASSETS_FOLDER/$NEW_FOLDER_NAME/$RAW_NAME-$DURATION-720
    OUTPUT_480=$ASSETS_FOLDER/$NEW_FOLDER_NAME/$RAW_NAME-$DURATION-480
    OUTPUT_240=$ASSETS_FOLDER/$NEW_FOLDER_NAME/$RAW_NAME-$DURATION-240

    echo rendering $RAW_NAME 'in' 720p
    ffmpeg -y -i $INPUT \
        -c:a aac -ac 2 \
        -vcodec h264 \
        -acodec aac \
        -movflags frag_keyframe+empty_moov+default_base_moof \
        -b:v 1500k \
        -maxrate 1500k \
        -bufsize 1000k \
        -vf 'scale=-1:720' \
        -v quiet \
        $OUTPUT_720.mp4
        
    echo rendering $RAW_NAME 'in' 480p
    ffmpeg -y -i $INPUT \
        -c:a aac -ac 2 \
        -vcodec h264 \
        -acodec aac \
        -movflags frag_keyframe+empty_moov+default_base_moof \
        -b:v 500k \
        -maxrate 500k \
        -bufsize 500k \
        -vf 'scale=854:480' \
        -v quiet \
        $OUTPUT_480.mp4
        
    echo rendering $RAW_NAME 'in' 240p
    ffmpeg -y -i $INPUT \
        -c:a aac -ac 2 \
        -vcodec h264 \
        -acodec aac \
        -movflags frag_keyframe+empty_moov+default_base_moof \
        -b:v 300k \
        -maxrate 300k \
        -bufsize 300k \
        -vf 'scale=426:240' \
        -v quiet \
        $OUTPUT_240.mp4


done

    