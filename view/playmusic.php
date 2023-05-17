<div class="play_music" id="play_music" category="">
    <div class="sub_left">
        <div class="audio">
            <img src="" alt="">
            <div class="runAudio">
                <div><span></span><span></span><span></span><span></span></div>
            </div>
        </div>
        <div class="name_music"></div>
        <div class="des">
            <div class="author"></div>
            <span>-</span>
            <div class="releaseDate"></div>
        </div>
        <div class="like"></div>
        <div class="controls">
            <button class="btnPlay active">
                <ion-icon name="play"></ion-icon> TIẾP TỤC PHÁT
            </button>
            <button class="btnPause">
                <ion-icon name="pause-outline"></ion-icon> TẠM DỪNG
            </button>
        </div>
        <!-- 
        <div class="musicFixed">
            <div class="centerMusicFixed">
                <ul class="navMusicFixed">
                    <li class="randomMusic">
                        <ion-icon name="shuffle-outline"></ion-icon>
                    </li>
                    <li class="prevMusic">
                        <ion-icon name="play-skip-back-outline"></ion-icon>
                    </li>
                    <li class="controlsMusic">
                        <ion-icon name="play"></ion-icon>
                        <ion-icon name="pause-outline" class="active"></ion-icon>
                    </li>
                    <li class="nextMusic">
                        <ion-icon name="play-skip-forward-outline"></ion-icon>
                    </li>
                    <li class="repeatMusic">
                        <ion-icon name="repeat-outline"></ion-icon>
                    </li>
                </ul>

                <div class="sliderMusic">
                    <div class="runTime">00:00</div>
                    <div class="slider">
                        <input id="progress" class="progress" type="range" value="0" step="1" min="0" max="100">
                        <div class="progressColor"></div>
                    </div>
                    <div class="sumTime">00:00</div>
                </div>
            </div>
        </div> -->

        <div class="anotherChoice">
            <div class="<?php
                        if (!empty($_SESSION["id"])) {
                            echo "add_library";
                        } else {
                            echo "";
                        }
                        ?>" style="margin-right: 10px;">
                <ion-icon name="heart"></ion-icon>
            </div>
            <div>
                <ion-icon name="add-outline"></ion-icon>
            </div>
        </div>
    </div>


    <div class="sub_right same_list_music">
        <div class="list_music_playing list_music_render" id="listening">
            <div class="titleHeaderMusic">
                <div>BÀI HÁT</div>
                <div>THỜI GIAN</div>
            </div>
            <ul class="">
                <!-- render list music -->
            </ul>
        </div>

        <div class="list_music_render careMusic">
            <div class="titleListCare">CÓ THỂ BẠN QUAN TÂM</div>
            <div class="titleHeaderMusic">
                <div>BÀI HÁT</div>
                <div>THỜI GIAN</div>
            </div>
            <ul class="music" id="careMusic">
                <!-- render music care -->
            </ul>
        </div>
    </div>
</div>