document.addEventListener('DOMContentLoaded', () => {

    function formatDDMMYY(date){
        let arr = date.split("-");
        return arr[2]+"-"+arr[1]+"-"+arr[0];
    }
    document.querySelector('.logo').addEventListener('click',()=>{
        location.reload();
    })
    
    // // định tuyến 
    const navLibrary = document.getElementById('nav_library');
    const navPlaylist = document.getElementById('nav_playlist');
    // // play video
    const audio = document.getElementById('audio');
    const btn_toggle_music = document.querySelector('.controlsMusic');
    const musicFixed = document.querySelector('.musicFixed');
    const progressColor = document.querySelector('.progressColor');
    const progress = document.querySelector('#progress');
    const runTime = document.querySelector('.sliderMusic .runTime');
    const sumTime = document.querySelector('.sliderMusic .sumTime');
    const music_fixed_left = document.querySelector('.musicFixed .leftMusicFixed');
    const repeatMusic = document.querySelector('.musicFixed .repeatMusic');
    const randomMusic = document.querySelector('.musicFixed .randomMusic');
    const nextMusic = document.querySelector('.musicFixed .nextMusic');
    const prevMusic = document.querySelector('.musicFixed .prevMusic');
    const highVolumn = document.querySelector('.volumeMusic .high');
    const muteVolumn = document.querySelector('.volumeMusic .mute');
    const snackbar = document.querySelector('#snackbar');
    const snackbar_text = document.querySelector('#snackbar .text p');
    let second ='';
    let countSecond = 0;
    let minute = '';
    let countMinute = 0;
    
    let isRepeat = false;
    let isRandom = false;
    let isPlaying = false;
    let isPaused = false;
    
    let currentIndex = -1;
    let currentId = 0;
    let uID = $.cookie('u_id');    

    navPlaylist.addEventListener('click',()=>{
        if(window.innerWidth > 768){
            if(uID == undefined){
                document.getElementById('message-playlist').classList.toggle('active');
                if(document.getElementById('message-library').classList.contains('active')){
                    document.getElementById('message-library').classList.remove('active');
                }
            }
            else{
                document.getElementById('form_upload_playlist').classList.add('active');
                if(window.innerWidth <= 768){
                    document.querySelector('.container .main_left').classList.remove('active');
                    $('#blur').css('display','none');
                }
            }
        }
        else{
            if(uID === undefined){
                $('.confirm_dialog').css("display","flex");
                $('.confirm_dialog').css("z-index","10000000000000000000000000000000000000000000");
                $('.confirm_dialog p').text('Đăng nhập để tiếp tục.');
                $('.confirm_dialog a#yes').text('Đăng nhập');
                $('.confirm_dialog a#yes').attr('href','./controller/login.php');
                $('.confirm_dialog a#no').text('Để sau');
            
                document.querySelector('.confirm_dialog').addEventListener('click',e=>{
                    if(e.target === e.currentTarget){
                    e.target.style.display = 'none';
                    $('#blur').css('display','block');

                    }
                })

                $('.confirm_dialog a#no').click(function(e){
                    $('.confirm_dialog').css("display","none");
                    $('#blur').css('display','block');
                })
            }
            else{
                document.getElementById('form_upload_playlist').classList.add('active');
                if(window.innerWidth <= 768){
                    document.querySelector('.container .main_left').classList.remove('active');
                    $('#blur').css('display','none');
                }
            }

        }
    })  
    
    navLibrary.addEventListener('click',()=>{
        if(window.innerWidth > 768){
            if(uID == undefined){
                document.getElementById('message-library').classList.toggle('active');
                if(document.getElementById('message-playlist').classList.contains('active')){
                    document.getElementById('message-playlist').classList.remove('active');
                }
            }
        }
        else{
            if(uID == undefined){
                $('.confirm_dialog').css("display","flex");
                $('.confirm_dialog').css("z-index","10000000000000000000000000000000000000000000");
                $('.confirm_dialog p').text('Đăng nhập để tiếp tục.');
                $('.confirm_dialog a#yes').text('Đăng nhập');
                $('.confirm_dialog a#yes').attr('href','./controller/login.php');
                $('.confirm_dialog a#no').text('Để sau');
                document.querySelector('.confirm_dialog').addEventListener('click',e=>{
                    if(e.target === e.currentTarget){
                    e.target.style.display = 'none';
                        $('#blur').css('display','block');
                    }
                })

                $('.confirm_dialog a#no').click(function(e){
                    $('.confirm_dialog').css("display","none");
                    $('#blur').css('display','block');


                })
            }
        }
    })  
    // // khi song play
    audio.onplay = function(){
        isPlaying = true;
        isPaused = false;
        btn_toggle_music.querySelector('ion-icon[name="pause-outline"]').classList.add('active');
        btn_toggle_music.querySelector('ion-icon[name="play"]').classList.remove('active');
        let lastIndex = $.cookie('lastIndex');
        if(lastIndex > -1 &&  document.querySelectorAll('ul.music li.song')[lastIndex].querySelector('.playMusic') &&
        document.querySelectorAll('ul.music li.song')[lastIndex].querySelector('.runAudio')){
            document.querySelectorAll('ul.music li.song')[lastIndex].querySelector('.playMusic').classList.remove('active');
            document.querySelectorAll('ul.music li.song')[lastIndex].querySelector('.runAudio').classList.remove('active');
        }
        
        if(document.querySelector('ul.music li.song.active .playMusic') && document.querySelector('.song.active .runAudio')){
            document.querySelector('ul.music li.song.active .playMusic').classList.add('active');
            document.querySelector('ul.music li.song.active .runAudio').classList.add('active');
        }
        if(window.innerWidth <= 768){
            document.querySelector('.img_playMusic_mobile').style.display = 'block';
        }
    }
    // // khi song pause
    audio.onpause = function(){
        isPlaying = false;
        isPaused = true;
        btn_toggle_music.querySelector('ion-icon[name="play"]').classList.add('active');
        btn_toggle_music.querySelector('ion-icon[name="pause-outline"]').classList.remove('active');
        document.querySelector('ul.music li.song.active .playMusic').classList.remove('active');
        document.querySelector('ul.music li.song.active .runAudio').classList.remove('active');
    }
    
    btn_toggle_music.onclick = function(){
        if(isPlaying){
            audio.pause();
        }
        else{
            audio.play();
    
        }
    }
    
    // // progress slider
    progress.oninput = function (e) {
        if(audio.currentTime){
            const seekTime = (audio.duration / 100) * Number(e.target.value);
            audio.currentTime = seekTime.toFixed(0);
        }
            
        }; 
    audio.ontimeupdate = function(){
        if (audio.duration) {
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);  
            progress.value = Math.floor((audio.currentTime / audio.duration) * 100);
            progressColor.style.right = 100 - progressPercent+ '%';
            // set second
            countSecond = Math.floor(audio.currentTime % 60) ;
            countMinute = Math.floor(audio.currentTime / 60);
            second = countSecond < 10? '0'+countSecond:countSecond;
            minute = countMinute < 10? '0'+countMinute:countMinute;
            runTime.innerHTML = `${minute}:${second}`
        }
    }
    
    
    // // repeat music
    repeatMusic.onclick = function(e){
        isRepeat = true;
        if(e.target.parentElement.classList.contains('active')){
            e.target.parentElement.classList.remove('active');
        }
        else{
            e.target.parentElement.classList.add('active');
            if(randomMusic.classList.contains('active')){
                randomMusic.classList.remove('active');
                isRandom = false;
            }
        }
    }
    randomMusic.onclick = function(e){
        isRandom = true;
        if(e.target.parentElement.classList.contains('active')){
            e.target.parentElement.classList.remove('active');
        }
        else{
            e.target.parentElement.classList.add('active');
            if(repeatMusic.classList.contains('active')){
                repeatMusic.classList.remove('active');
                isRepeat = false;
        }
        }
    }
    
    // volumn
    audio.volume = 0.5;
    document.querySelector('.volumeMusic input').oninput = function(e){
        let volumnVal =(e.target.value)/100; 
        audio.volume = volumnVal;
        document.querySelector('.rightMusicFixed .progressColor').style.right = (1 - volumnVal)*100 + '%';
            if(e.target.value <= 0){
                highVolumn.classList.remove('active')
                muteVolumn.classList.add('active')
            }
            else{
                highVolumn.classList.add('active')
                muteVolumn.classList.remove('active')
    
            }
    }
    highVolumn.addEventListener('click',e=>{
        if(e.target === e.currentTarget){
            e.target.classList.toggle('active');
            muteVolumn.classList.add('active')
            audio.volume = 0;
            document.querySelector('.rightMusicFixed .progressColor').style.right = 100 + '%';
        }
    })
    muteVolumn.addEventListener('click',e=>{
        if(e.target === e.currentTarget){
            e.target.classList.toggle('active');
            highVolumn.classList.add('active')
            audio.volume = 0.5;
            document.querySelector('.rightMusicFixed .progressColor').style.right = 50 + '%';
    
        }
    })
    
    function loadCurrentSong(musics){
        audio.src = musics[currentIndex].src;   
    }

    function load_music_fixed(){
        $.get('./controller/select_data.php',{'song_id':currentId},function(response){
            if(response != 'empty'){
                let data= JSON.parse(response);
                listening_Music(data, $('.list_music_playing > ul'));
                if($('#play_music').attr('category') === "playmusic"){
                    $('.play_music .audio img').attr('src',data.img);   
                    $('.play_music .name_music').html(data.name);
                    $('.play_music .des .author').html(data.artist);
                    if($('.play_music .releaseDate')){
                        $('.play_music .releaseDate').html(formatDDMMYY(data.date));
                    }
                    if($('.play_music .sub_left .like')){
                        $('.play_music .sub_left .like').html(`Lượt nghe: ${data.quatityLis}`);
                    }
                }

                if(document.querySelector('.img_playMusic_mobile img')){
                    document.querySelector('.img_playMusic_mobile img').src = data.img;
                }


                audio.addEventListener('play',()=>{
                    $('.btnPause').addClass('active');
                    $('.btnPlay').removeClass('active');
                    $('.list_music_playing li > div:first-child ion-icon').css('animationPlayState', 'running');
                    $('.play_music .sub_left .runAudio').addClass('active');
        
                })
                audio.addEventListener('pause',()=>{
                    $('.btnPlay').addClass('active');
                    $('.btnPause').removeClass('active');
                    $('.list_music_playing li > div:first-child ion-icon').css('animationPlayState', 'paused');
                    $('.play_music .sub_left .runAudio').removeClass('active');
        
                })
            }
            else{
                alert('empty');
            }
        })
    }
    function eventClick(musics, event,isClick = ""){
        let lastIndex = -1;
        if(isClick == "" || isClick == "search"){
            document.querySelectorAll('.song.active').forEach(item=>{
                item.classList.remove('active');
            })
            const songNode = event.target.closest('ul.music li.song');
            songNode.classList.add('active');
            lastIndex = currentIndex;
            currentIndex = Number(songNode.getAttribute('index'));
            $.cookie('lastIndex',lastIndex);
            currentId = musics[currentIndex].m_id;
            
            audio.onended = function(){
                jQuery.ajax({
                    url: './controller/select_data.php',
                    type: 'POST',
                    dataType: 'html',
                    data:  {"song_id":currentId,"updateListen":"updateListen"},
                    success:function(ketqua) {
                        
                    }
                });
                if(isRepeat){
                    audio.play();
                }
                else if(isRandom){
                    let newIndex;
                    do {
                      newIndex = Math.floor(Math.random() * musics.length);
                    } while (newIndex === currentIndex);
                    lastIndex = currentIndex;
                    currentIndex = newIndex;
                    $.cookie('lastIndex',lastIndex);
                    currentId = musics[currentIndex].m_id;
                    isPlaying = true;
                    isPaused = false;
                    loadCurrentSong(musics);
                    audio.play();
                    musicFixed.style.display = 'flex';  
                    load_music_fixed_left(musics[currentIndex]);
                    sumTime.innerHTML = musics[currentIndex].time;
                    document.querySelectorAll('ul.music li.song.active').forEach(item=>{
                        item.classList.remove('active');
                    })
                    if( document.querySelectorAll('ul.music li.song')[currentIndex] &&  document.querySelectorAll('ul.music li.song')[currentIndex].getAttribute('id_song') === currentId){
                        document.querySelectorAll('ul.music li.song')[currentIndex].classList.add('active');
                    } 
                    load_music_fixed();
                }
                else{
                    audio.pause();
                }
            }
            nextMusic.onclick = function(){
                lastIndex = currentIndex;
                currentIndex++;
                if (currentIndex >= musics.length) {
                    currentIndex = 0;
                }
                $.cookie('lastIndex',lastIndex);  
                currentId = musics[currentIndex].m_id;
                loadCurrentSong(musics);
                audio.play();
                musicFixed.style.display = 'flex';  
                load_music_fixed_left(musics[currentIndex]);
                sumTime.innerHTML = musics[currentIndex].time;
                document.querySelectorAll('ul.music li.song.active').forEach(item=>{
                    item.classList.remove('active');
                })
                if( document.querySelectorAll('ul.music li.song')[currentIndex] &&  document.querySelectorAll('ul.music li.song')[currentIndex].getAttribute('id_song') === currentId){
                    document.querySelectorAll('ul.music li.song')[currentIndex].classList.add('active');
                }
                load_music_fixed();

            }
            prevMusic.onclick = function(){
                lastIndex = currentIndex;
                currentIndex--;
                if (currentIndex < 0) {
                    currentIndex = musics.length-1;
                }
                $.cookie('lastIndex',lastIndex);
                currentId = musics[currentIndex].m_id;
                loadCurrentSong(musics);
                audio.play();
                musicFixed.style.display = 'flex';  
                load_music_fixed_left(musics[currentIndex]);
                sumTime.innerHTML = musics[currentIndex].time;
                document.querySelectorAll('ul.music li.song.active').forEach(item=>{
                    item.classList.remove('active');
                })
                if( document.querySelectorAll('ul.music li.song')[currentIndex] &&  document.querySelectorAll('ul.music li.song')[currentIndex].getAttribute('id_song') === currentId){
                    document.querySelectorAll('ul.music li.song')[currentIndex].classList.add('active');
                }

                load_music_fixed();

            }
            isPlaying = true;
            isPaused = false;
            loadCurrentSong(musics);
            audio.play();
            musicFixed.style.display = 'flex';  
            load_music_fixed_left(musics[currentIndex]);        
            sumTime.innerHTML = musics[currentIndex].time;
            load_music_fixed();

            
            if(isClick == "search"){
                document.querySelectorAll('ul.music li.song').forEach(item=>item.remove());
                $("main").load('./view/playmusic.php',function(){
                    $('#play_music').attr('category','playmusic');
                    $('.btnPause').addClass('active');
                    $('.btnPlay').removeClass('active');
                    $('.list_music_playing li > div:first-child ion-icon').css('animationPlayState', 'running');
                    $('.play_music .sub_left .runAudio').addClass('active');
                    $('.btnPlay').click(function(){
                        audio.play();
                    })
                    $('.btnPause').click(function(){
                        audio.pause();
        
                    })
                    load_music_fixed();
                    $.get('./controller/select_data.php',{'key':"getAllData"},function(response){
                        if(response != 'empty_data_music'){
                            let data= JSON.parse(response);
                            let filterData = data.filter(data=>{
                                return data.m_id !== currentId;
                            })
                            load_music(data,document.querySelector('#careMusic'));
                            handlePlayMusic(document.querySelector('#careMusic'),data);
                        }
                        else{
                            alert('empty');
                        }
                    })
                });
                $("#listSearch").css("display","none");
                $("#searchInput").val("");

            }
        }
        else if(isClick === "add_library"){
            let id = event.target.closest('ul.music li.song').getAttribute('id_song');
            let data = {'id':id,'action':"add"};
            jQuery.ajax({
                url: './controller/addLibrary.php',
                type: 'POST',
                dataType: 'html',
                data:  data,
                success:function(ketqua) {
                    if(ketqua == "success"){
                        snackbar.classList.add('show');
                        snackbar.querySelector('ion-icon').setAttribute('name','checkmark-done-circle-outline');
                        snackbar_text.innerHTML = "<p style='color:green'>Thêm thành công!</p>";
                        setTimeout(()=>{
                           snackbar.classList.remove("show");
                        },1500)
                    }
                    else if(ketqua == "existed"){
                        snackbar.classList.add('show');
                        snackbar.querySelector('ion-icon').setAttribute('name','warning-outline');
    
                        snackbar_text.innerHTML = "<p style='color:orange'>Bài hát này đã có trong thư viện.</p>";
                        setTimeout(()=>{
                           snackbar.classList.remove("show");
                        },1500)
    
                    }
                    else{
                        snackbar.classList.add('show');
                        snackbar.querySelector('ion-icon').setAttribute('name','bug-outline');
                        snackbar_text.innerHTML = "<p style='color:red'>Đăng nhập để tiếp tục!</p>";
                        setTimeout(()=>{
                           snackbar.classList.remove("show");
                        },1500)
    
                    }
                }
            });
        }
        else if(isClick == "delete_library"){
            let category = event.target.closest('ul').getAttribute('category')
            let id = event.target.closest('ul.music li.song').getAttribute('id_song');
            let pl_id = $.cookie('pl_id');
            let data = {'id':id,'action':"delete","pl_id":pl_id,'category':category};
            let elem = event.target.closest('ul.music li.song');
            jQuery.ajax({
                url: './controller/addLibrary.php',
                type: 'POST',
                dataType: 'html',
                data: data,
                success:function(ketqua) {
                    console.log(ketqua);
                    if(ketqua == "success"){
                        snackbar.classList.add('show');
                        snackbar.querySelector('ion-icon').setAttribute('name','checkmark-done-circle-outline');
                        snackbar_text.innerHTML = "<p style='color:green'>Xóa thành công!</p>";
                        setTimeout(()=>{
                           snackbar.classList.remove("show");
                        },1500)
                        elem.remove();
                        let pl_id =  $.cookie('pl_id');
                        let data_get_plItem = {"u_id":uID, "pl_id":pl_id,"action":"getPlaylistItem"};
                        jQuery.get("./controller/select_data.php", data_get_plItem, function(response) {
                            if(response == "empty_data_playlistItem"){
                                document.querySelector('#list_music_playlist').classList.remove('active');
                                document.querySelector('.message_null_playlist').classList.remove('active');
                            }
                        })
                        
                        if(category === "uploaded"){
                            var data = {'u_id': $.cookie('u_id'), 'btn_uploaded_id':"upLoaded"};
                            $.get("./controller/select_data.php", data, function(response) {
                                if(response == "empty_data_upload"){
                                    $('#data_library').html(`<li>Chưa có bài hát nào được thêm vào hoặc tải lên.</li>`);
                                }
                            });
                        }

                       else{
                            var data = {'u_id': $.cookie('u_id'), 'btn_uploaded_id':"liked"};
                            $.get("./controller/select_data.php", data, function(response) {
                                if(response == "empty_data_like"){
                                    $('#data_library').html(`<li>Chưa có bài hát nào được thêm vào hoặc tải lên.</li>`);
                                }
                            });
                       }
                    }
                    else if(ketqua == "UserExits"){
                        snackbar.classList.add('show');
                        snackbar.querySelector('ion-icon').setAttribute('name','warning-outline');
    
                        snackbar_text.innerHTML = "<p style='color:orange'>Nguời dùng không tồn tại.</p>";
                        setTimeout(()=>{
                           snackbar.classList.remove("show");
                        },1500)
    
                    }
                    else{
                        snackbar.classList.add('show');
                        snackbar.querySelector('ion-icon').setAttribute('name','bug-outline');
                        snackbar_text.innerHTML = "<p style='color:red'>Đăng nhập để tiếp tục!</p>";
                        setTimeout(()=>{
                           snackbar.classList.remove("show");
                        },1500)
    
                    }
                }
            });
        }
        else if(isClick == "add_playlist"){

            if(uID != undefined){
                let _event = event;
                if(event.target.closest('ul.music li.song')){
                    if(document.querySelector('.list_choose_playlist.active'))
                        document.querySelector('.list_choose_playlist.active').classList.remove('active');
                    event.target.closest('ul.music li.song').querySelector('.list_choose_playlist').classList.toggle('active');
                    $('#blur').css('display','block');
                    $('#blur').click(function(e){
                        if(e.target === e.currentTarget){
                            event.target.closest('ul.music li.song').querySelector('.list_choose_playlist').classList.remove('active');
                            $('#blur').css('display','none');
                        }
                    })
                }
                var data = {'u_id': uID,"getPlaylist":"getPlaylist"};
                jQuery.get("./controller/select_data.php", data, function(response) {
                    let data = "";
                    if(response != "empty_data_playlist"){
                        data = JSON.parse(response);
                        if(_event.target.closest('ul.music li.song').querySelector('.load_list_playlist')){
                            let plNode = _event.target.closest('ul.music li.song').querySelector('.load_list_playlist');
                            load_list_playlist(data,_event.target.closest('ul.music li.song').querySelector('.load_list_playlist'));
                            plNode.addEventListener('click',e=>{
                                if(e.target.closest('li._playlist')){
                                    if(e.target.closest('.list_choose_playlist')){
                                        e.target.closest('.list_choose_playlist').classList.remove('active');
                                    }
                                    let songId;
                                    if(_event.target.closest('ul.music li.song')){
                                        songId = _event.target.closest('ul.music li.song').getAttribute('id_song');
                                    }
                                    if( _event.target.closest('#careMusic li.song')){
                                        _event.target.closest('#careMusic li.song').remove();
                                    }
                                    let pl_id = e.target.getAttribute("id_playlist");
                                    let data = {'id':songId,"pl_id":pl_id,'action':"add_playlist"};
                                    
                                    jQuery.ajax({
                                        url: './controller/addLibrary.php',
                                        type: 'POST',
                                        dataType: 'html',
                                        data: data,
                                        success:function(ketqua) {
                                            if(ketqua === "success_add_pl"){
                                                snackbar.classList.add('show');
                                                snackbar.querySelector('ion-icon').setAttribute('name','checkmark-done-circle-outline');
                                                snackbar_text.innerHTML = "<p style='color:green'>Thêm vào playlist thành công!</p>";
                                                setTimeout(()=>{
                                                    snackbar.classList.remove("show");
                                                },1500)
                                                $('#blur').css('display','none');
                                               
                                                let pl_id =  $.cookie('pl_id');
                                                let data_get_plItem = {"u_id":uID, "pl_id":pl_id,"action":"getPlaylistItem"};
    
                                                jQuery.get("./controller/select_data.php", data_get_plItem, function(response) {
                                                    let data = "";
                                                    if(response != "empty_data_playlistItem"){
                                                        data = JSON.parse(response);
                                                        if(document.querySelector('#list_music_playlist') != null && document.querySelector('.message_null_playlist') != null){
                                                            document.querySelector('#list_music_playlist').classList.add('active');
                                                            document.querySelector('.message_null_playlist').classList.add('active');
                                                            load_music(data,document.querySelector('#list_music_playlist ul'),true);
                                                            document.querySelector('#list_music_playlist ul').setAttribute('category','playlisted');
                                                            handlePlayMusic(document.querySelector('#list_music_playlist ul'),data);
                                                        }
                                                    }
                                                })
                                            }
                                            else if(ketqua === "existed"){
                                                snackbar.classList.add('show');
                                                snackbar.querySelector('ion-icon').setAttribute('name','warning-outline');
                                                snackbar_text.innerHTML = "<p style='color:orange'>Bài hát đã có trong playlist</p>";
                                                setTimeout(()=>{
                                                    snackbar.classList.remove("show");
                                                },1500)
                                                $('#blur').css('display','none');
                            
                                            }
                                        }
                                    });
                                    
                                }
                            })
                        }
                        
                    }
                    else{
                        $('.load_list_playlist').html('<li>Không có playlist</li>');
                    }
                })
            }
            else{
                snackbar.classList.add('show');
                snackbar.querySelector('ion-icon').setAttribute('name','bug-outline');
                snackbar_text.innerHTML = "<p style='color:red'>Đăng nhập để tiếp tục!</p>";
                setTimeout(()=>{
                snackbar.classList.remove("show");
                },1500)
            }

        
        }
    }
    function handleClickPlayMusic(elemPlayMusic,musics){
        elemPlayMusic.ondblclick = function(e){
            if(isPlaying && e.target.closest('.song.active')){
                audio.pause();
            }
            else if(isPaused && e.target.closest('.song.active')){
                audio.play();
            }
            else{
                eventClick(musics,e);
            }
        }
    }
    
    function handlePlayMusic(element_main,musics,search = ""){
        element_main.onclick = function(e){
            if(e.target.closest('.playMusic') && e.target.closest('.song.active')){
                audio.play();
            }
            else if(e.target.closest('.playMusic')){
               eventClick(musics,e);
            }
            else if(e.target.closest('#add_library')){
                eventClick(musics,e,"add_library");
            }
            else if(e.target.closest('#delete_library')){
                eventClick(musics,e,"delete_library");
            }
            else if(e.target.closest('#add_playlist')){
                eventClick(musics,e,"add_playlist");
            }
            else if(e.target.closest('ul.music li.song') && search != ""){
                eventClick(musics,e,search);
            }
            else{
                if(window.innerWidth <= 768 && e.target.closest('li.song')){
                    eventClick(musics,e);
                }
                else{
                    handleClickPlayMusic(e.target.closest('ul.music li.song'),musics);
                }
            }
        }
    }
    
    function load_music_discover(musics,elem){
        let data = musics.map((music,index)=>{
            return `          <li class="song ${currentId === music.m_id ? "active" : ""}" index="${index}" id_song="${music.m_id}">
                                <div class="contentMusic">
                                    <div class="imageMusic">
                                        <img src="${music.img}" alt="">
                                        <div class="playMusic ${currentId === music.m_id && isPlaying  ? "active" : ""}">
                                            <ion-icon name="play"></ion-icon>
                                        </div>
                                        <div class="runAudio ${currentId === music.m_id && isPlaying ? "active" : ""}">
                                            <div><span></span><span></span><span></span><span></span></div>
                                        </div>
                                    </div>
                                    <div class="desMusic">
                                        <div class="nameMusic">${music.name}</div>
                                        <div class="authorMusic">${music.artist}</div>
                                        <div class="time_up">${formatDDMMYY(music.date)}</div>
                                    </div>
                                    <div class="hoverItem">
                                        <div class="hoverAnotherChoice">
                                        <div class="add_library" id="add_library"> 
                                        <div class="tooltip">
                                            <ion-icon name="heart"></ion-icon>
                                            <span class="tooltiptext">Thêm vào thư viện</span>
                                        </div>
                                    </div>
                                        <div class="add_playlist" id="add_playlist">
                                            <div class="tooltip">
                                            <ion-icon name="add-outline"></ion-icon>
                                                <span class="tooltiptext">Thêm vào Play list</span>
                                            </div>
                                           
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="list_choose_playlist">
                                    <h3>Danh sách</h3>
                                    <ul class="load_list_playlist">
                                   
                                    </ul>
                                </div>
                            </li>`
        })
        elem.innerHTML = data.join("");
        handlePlayMusic(elem,musics);
    }
    
    function load_music(musics, element, showDelete = false){
        let html = [];
        if(Array.isArray(musics) && musics.length > 0){
                html = musics.map((music,index)=>{
                    return `<li class="song  ${currentId === music.m_id ? "active" : ""}" index="${index}" id_song="${music.m_id}">
                                <div class='idMusic'><ion-icon name="musical-notes-outline"></ion-icon></div>
                                <div class="contentMusic">
                                    <div class="imageMusic">
                                        <img src="${music.img}" alt="">
                                        <div class="playMusic ${currentId === music.m_id && isPlaying ? "active" : ""}">
                                        <ion-icon name="play"></ion-icon></div>
                                        <div class="runAudio ${currentId === music.m_id && isPlaying ? "active" : ""}">
                                        <div><span></span><span></span><span></span><span></span></div>
                                    </div>
                                    </div>
                                    <div class="desMusic">
                                        <div class="nameMusic">${music.name}</div>
                                        <div class="authorMusic">${music.artist}</div>
                                    </div>
                                </div>
                                <div class="timeMusic">${music.time}</div>
                                <div class="hoverItem">
                                    <div class="hoverAnotherChoice">
                                        <div class="add_library" id="add_library" style="${showDelete == true ? "display:none":""}">
                                            <div class="tooltip">
                                                <ion-icon name="heart"></ion-icon>
                                                <span class="tooltiptext">Thêm vào thư viện</span>
                                            </div>
                                        </div>
                                        <div class="add_library" id="delete_library" style="${showDelete == false ? "display:none":""}">
                                            <div class="tooltip">
                                                <ion-icon name="close"></ion-icon>
                                                <span class="tooltiptext">Xóa khỏi thư viện</span>
                                            </div>
                                        </div>
                                        
                                         <div class="add_playlist" id="add_playlist">
                                            <div class="tooltip">
                                            <ion-icon name="add-outline"></ion-icon>
                                                <span class="tooltiptext">Thêm vào Play list</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="list_choose_playlist">
                                <h3>Danh sách</h3>
                                <ul class="load_list_playlist">
                               
                                </ul>
                            </div>
                            </li>`;
            })
        }
        element.innerHTML = html.join("");
    }
    
    function load_music_fixed_left(music){
        musicFixed.setAttribute("song_id",music.m_id);
        music_fixed_left.innerHTML = `
                            <img src="${music.img}" alt="">
                            <div class="desMusicFixed">
                                <div class="nameMusicFixed"><a>${music.name}</a></div>
                                <div class="authorMusicFixed">${music.artist}</div>
                            </div>
                            <div class="AnotherChoiceFixed">
                            <div class="add_library" id="add_library">
                            <div class="tooltip">
                                <ion-icon name="heart"></ion-icon>
                                <span class="tooltiptext">Thêm vào thư viện</span>
                            </div>
                        </div>
                                <div class="add_playlist" id="add_playlist">
                                <div class="tooltip">
                                <ion-icon name="add-outline"></ion-icon>
                                    <span class="tooltiptext">Thêm vào Play list</span>
                                </div>
                                </div>
                            </div>
        `
    }
    
    // load playlist library{}
    function load_playlist_library(datas){
        let html = datas.map((data,index)=>{
            return `<li class="playlist_item" index="${index}" id_playlist="${data.pl_id}">
            <div class="content">
                <img src="../uploads/${data.img}" alt="">
                <div class="hover_playlist">
                    <ion-icon name="close-outline" id="delete_playlist"></ion-icon>
                    <ion-icon name="play" id="run_playlist"></ion-icon>
                    <ion-icon name="heart"></ion-icon>
                </div>
            </div>
            <div class="name_pl" style="margin: 4px 0 2px 0;">${data.name_playlist}</div>
            <div class="author_pl">${data.name}</div>
        </li>`;
        })    
        document.getElementById('list_playlist').innerHTML = html.join("");
    }
    
    function load_list_playlist(datas,element_main){
        let html = datas.map((data,index)=>{
            return ` <li id_playlist="${data.pl_id}" class='_playlist' >
                        <ion-icon name="musical-note-outline"></ion-icon>
                        ${data.name_playlist}
                    </li>`;
        })    
        element_main.innerHTML = html.join("");
    }
    // // listening to music
    function listening_Music(music,elem){
        elem.html(`<li class="song  id_song="${music.m_id}">
        <div><ion-icon name="musical-notes-outline"></ion-icon></div>
        <div class="contentMusic">
            <div class="imageMusic">
                <img src="${music.img}" alt="">
            </div>
            <div class="desMusic">
                <div class="nameMusic">${music.name}</div>
                <div class="authorMusic">${music.artist}</div>
            </div>
        </div>
        <div class="timeMusic">${music.time}</div>
       
    </li>
`)  
    }
    
    

    //     // show list play music
        const btnShowList = document.querySelector('.btn_run_listPlaymusic ion-icon');
        btnShowList.addEventListener('click',e=>{
            if(e.target === e.currentTarget){
                document.querySelector('.list_play_music').classList.toggle('active');
                $('#blur').css('display','block');
                if(!document.querySelector('.list_play_music').classList.contains('active')){
                    $('#blur').css('display','none');       
                }
                $('#blur').click(function(e){
                    if(e.target === e.currentTarget){
                        document.querySelector('.list_play_music').classList.remove('active');
                        $('#blur').css('display','none');
                    }
                })
                e.target.parentElement.classList.toggle('active');
                if(document.querySelector('.list_play_music').classList.contains('active')
                    && document.querySelector('.update_profile').classList.contains('active')){
                   document.querySelector('.update_profile').classList.toggle('active');
                }
            }
        })

    //     // click profile
        document.querySelector('.user .profile #imgUser').addEventListener('click',(e)=>{
            let u_id = $.cookie('u_id');
            if(e.target === e.currentTarget && u_id){
                document.querySelector('.update_profile').classList.add('active');
                if(document.querySelector('.container .main_left').classList.contains('active')){
                    document.querySelector('.container .main_left').classList.remove('active');
                }
                $('#blur').css('display','block');
                $('#blur').click(function(e){
                    if(e.target === e.currentTarget){
                        document.querySelector('.update_profile').classList.remove('active');
                        $('#blur').css('display','none');
                    }
                })
                if(document.querySelector('.update_profile').classList.contains('active')
                   && document.querySelector('.list_play_music').classList.contains('active')
                ){
                    document.querySelector('.list_play_music').classList.add('active')
                    e.target.parentElement.classList.add('active');
                  
                 }
            }
            else{
                document.querySelector('.container .main_left').classList.add('active');
                $('#blur').css('display','block');
                $('#blur').click(function(){
                    document.querySelector('.container .main_left').classList.remove('active');
                    $('#blur').css('display','none');
            
                });
            }
        })
        
        document.querySelectorAll('.close_form').forEach(item=>{
            item.addEventListener('click',e=>{
                if(e.target === e.currentTarget){
                    if( e.target.closest('.form_upload').classList.contains('active'))
                        e.target.closest('.form_upload').classList.remove('active');
                        $('#blur').css('display','none');
                        
                }
            })
        })
       
        
        document.querySelector('.imgUser').addEventListener('click',()=>{
            document.getElementById('form_upload_avatar').classList.add('active');
        })
        document.querySelector('#close_profile ion-icon').addEventListener('click',(e)=>{
            if(e.target === e.currentTarget)
                document.querySelector('.update_profile').classList.remove('active');
                $('#blur').css('display','none');

        })
    //     // up load
        if(document.getElementById('upload')){
            document.getElementById('upload').addEventListener('click',e=>{
                e.preventDefault();
                if(e.target === e.currentTarget){
                    document.getElementById('form_upload_music').classList.add('active');
                }
            })
        }
        document.querySelectorAll('.form_upload').forEach(item=>{
            item.addEventListener('click',(e)=>{
                if(e.target === e.currentTarget){
                    e.target.classList.remove('active');
                    
                }
        
            })
        })
    
    
   
        
        $('#searchInput').on('focus',function(){
            $("#listSearch").css("display","block");
            $('#blur').css('display','block');
            $('#blur').click(function(e){
                if(e.target === e.currentTarget){
                    $("#listSearch").css("display","none");
                    $('#blur').css('display','none');
                }
            })
            let _this = this;
            $.get(`./controller/select_data.php?key=getAllData`, {}, function(response) {
                if(response != "empty_data_music" && response != "error"){
                    let datas = JSON.parse(response);
                    $(_this).on('input',function(e){
                        let html = '';
                        let searchVal = e.target.value.toLowerCase().trim();
                        if(searchVal != ''){
                            datas.forEach((data,index)=>{
                                if(data.name.toLowerCase().includes(searchVal)){
                                    html +=   `<li class="song  ${currentId === data.m_id ? "active" : ""}" index="${index}" >
                                                <div class="contentMusic">
                                                    <div class="imageMusic">
                                                        <img src="${data.img}" alt="">
                                                        <div class="playMusic ${currentId === data.m_id ? "active" : ""}"><ion-icon name="play"></ion-icon></div>
                                                        <div class="runAudio ${currentId === data.m_id ? "active" : ""}">
                                                        <div><span></span><span></span><span></span><span></span></div>
                                                    </div>
                                                    </div>
                                                    <div class="desMusic">
                                                        <div class="nameMusic">${data.name}</div>
                                                        <div class="authorMusic">${data.artist}</div>
                                                    </div>
                                                </div>
                                            </li>`
                                }
                            })
                            $('#listSearch ul').html(html != ''?html:"<li style='display:flex;justify-content:center;align-item:c'>Không tim thấy kết quả</li>");
                        }
                        else{
                            html += `<li style="display: flex;justify-content: center;align-items: center;">Bạn cần tìm kiếm
                            gì nào?</li>`;
                            $('#listSearch ul').html(html);
                    
                        }
                    })
                    handlePlayMusic(document.querySelector('#listSearch ul'),datas,"search");
                }     
                else if(response == "empty_data_music"){
                    alert('Empty');
                }
                else{
                    alert('Error');
                }
            });
        })
        
        
    
    
    $('.profile img#imgUser').on('click',function(){
        let _this = this;
        let u_id = $.cookie('u_id');
    
       if(u_id){
        var data = {'u_id': u_id, 'btn_uploaded_id':$(this).attr('id')};
        $.get("./controller/select_data.php", data, function(response) {
            if($(_this).attr('id') == "imgUser" && response != "empty_data_upload"){
                let data = JSON.parse(response);
                load_music( data,document.querySelector(".update_profile .playlist ul"),true);
                handlePlayMusic(document.querySelector(".update_profile .playlist ul"), data);
            }
            else{
                $(".update_profile .playlist ul").html(`<li>Chưa có bài hát nào được tải lên.</li>`);
            }
        });
       }
    })

    
    $('.main_left ul').on('click','a',function(){
        $('li.active').removeClass('active');
        $('#blur').css('display','none');
        $(this).closest('li').addClass('active');
        let u_id = $.cookie('u_id');
        let hrf = $(this).attr('href');
        var link = hrf.substring(1,hrf.length);
        if(link == `./view/home.php`){
            if(window.innerWidth <= 768){
                document.querySelector('.container .main_left').classList.remove('active');
                $('#blur').css('display','none');
            }
            $('main').load(link,function(){
                 // render home
                const home_music = document.querySelector('.first_home ul');
                const home_music_spotify = document.querySelector('.second_home ul');
                function load_music_home(musics){
                    let html = musics.map((music,index)=>{
                            return  `<li class="song" index="${index}" id_song = ${music.m_id}>
                                        <a href="#">
                                            <img src="${music.img}" alt="##">
                                            <div class="name">${music.name}</div>
                                            <div class="des">
                                                ${music.artist}
                                            </div>
                                        </a>
                                        <div><ion-icon name="caret-forward-outline"></ion-icon></div>
                                    </li>`
                    })
                    home_music.innerHTML = html.join("");
                    home_music_spotify.innerHTML = html.join("");
                    // handle home music
                    const list_home_music = document.querySelector('.first_home ul.music');
                    const list_home_music_spotify = document.querySelector('.second_home  ul.music');
                    handlePlayMusic(list_home_music,musics);
                    handlePlayMusic(list_home_music_spotify,musics);
                }
                $.get(`./controller/select_data.php?key=getAllData`, {}, function(response) {
                    if(response != "empty_data_music" && response != "error"){
                        let datas = JSON.parse(response);
                        load_music_home(datas);
                    }
                    else if(response == "empty_data_music"){
                        alert('Empty');
                    }
                    else{
                        alert('Error');
                    }
                });
            });
           

        }
        else if(link == `./view/discover.php`){
            if(window.innerWidth <= 768){
                document.querySelector('.container .main_left').classList.remove('active');
                $('#blur').css('display','none');
            }
            $('main').load(link,function(){
            //    slider
                setInterval(changeOrder, 5000);
                function changeOrder() {
                const allSlides = document.querySelectorAll(".single-slide");
                const previous = "1";
                const current = "2";
                const next = "3";

                for (const slide of allSlides) {
                    const order = slide.getAttribute("data-order");

                    switch (order) {
                    case current:
                        slide.setAttribute("data-order", previous);
                        break;
                    case next:
                        slide.setAttribute("data-order", current);
                        break;
                    case previous:
                        slide.setAttribute("data-order", next);
                        break;
                    }
                }
                }
                $("#discover .nav_country li.active").attr('class',"");
                $('#All').attr('class','active');
                $.get(`./controller/select_data.php?key=discover`, {}, function(response) {
                    if(response != "empty_data_music" && response != "error"){
                        load_music_discover(JSON.parse(response),document.querySelector('#discover .list_music'));
                    }
                    else if(response == "empty_data_music"){
                        alert('Empty');
                    }
                    else{
                        alert('Error');
                    }
                })
                $(".nav_country li").on('click',function(){
                    let _this = this;
                    $.get(`./controller/select_data.php?key=getAllData`, {}, function(response) {
                        if(response != "empty_data_music" && response != "error"){
                            let datas = JSON.parse(response);
                            let VN = datas.filter(data=>{
                                return data.nation == "Việt Nam";
                            })
                            let TG = datas.filter(data=>{
                                return data.nation != "Việt Nam";
                            })
                            if($(_this).attr('id') == 'All'){
                                load_music_discover(datas,document.querySelector('#discover .list_music'));
                                $("#discover .nav_country li.active").attr('class',"");
                                $(_this).attr('class','active');
                            }
                            else if($(_this).attr('id') == "VN"){
                                $("#discover .nav_country li.active").attr('class',"");
                                $(_this).attr('class','active');
                                load_music_discover(VN,document.querySelector('#discover .list_music'));
                            }
                            else{
                                $("#discover .nav_country li.active").attr('class',"");
                                $(_this).attr('class','active');
                                load_music_discover(TG,document.querySelector('#discover .list_music'));
                            }
                        }
                        else if(response == "empty_data_music"){
                            alert('Empty');
                        }
                        else{
                            alert('Error');
                        }
                    });
                })
                $('#showAll').on('click',function(){
                    $.get(`./controller/select_data.php?key=getAllData`, {}, function(response) {
                        if(response != "empty_data_music" && response != "error"){
                            load_music_discover(JSON.parse(response),document.querySelector('#discover .list_music'));   
                        }
                        else if(response == "empty_data_music"){
                            snackbar.classList.add('show');
                            snackbar.querySelector('ion-icon').setAttribute('name','warning-outline');
                            snackbar_text.innerHTML = "<p style='color:yellow'>Tất cả đã được hiển thị</p>";
                            setTimeout(()=>{
                                snackbar.classList.remove("show");
                            },1500)
                            $(location).attr('href', '../index.php');
                        }
                        else{
                            snackbar.classList.add('show');
                            snackbar.querySelector('ion-icon').setAttribute('name','bug-outline');
                            snackbar_text.innerHTML = "<p style='color:red'>Xảy ra lỗi không muốn.</p>";
                            setTimeout(()=>{
                            snackbar.classList.remove("show");
                            },1500)
                        }
                    });
                })
            });
        }
        if(link == `./view/library.php`){
            if(u_id != undefined){
                if(window.innerWidth <= 768){
                    document.querySelector('.container .main_left').classList.remove('active');
                    $('#blur').css('display','none');
                }
                $('main').load(link,function(){
                    document.getElementById('create_pl').addEventListener('click',()=>{
                        document.getElementById('form_upload_playlist').classList.add('active');
                    })
                    
                    document.querySelector('.confirm_dialog').addEventListener('click',e=>{
                        if(e.target === e.currentTarget){
                           e.target.style.display = 'none';
                        }
                    })

                    var data = {'u_id': u_id, 'btn_uploaded_id':'defaultLoad','getPlaylist':'getPlaylist'};
                    jQuery.get("./controller/select_data.php", data, function(response) {
                        if(response != "empty_data_like"){
                            const libraryMusic = document.querySelector('#data_library');
                            load_music(JSON.parse(response),libraryMusic,true);
                            handlePlayMusic(libraryMusic, JSON.parse(response));
                            libraryMusic.setAttribute('category','liked');
                        }
                        else{
                            $('#data_library').html(`<li>Chưa có bài hát nào được thêm vào hoặc tải lên.
                            </li>`);
                        }
                    });

                    $('.sub_nav_library li').on('click',function(){
    
                        $('.sub_nav_library li.active').removeClass('active');
                        $(this).addClass('active');
                        
                        let _this = this;
                        var data = {'u_id': $.cookie('u_id'), 'btn_uploaded_id':$(this).attr('id')};
                    
                        $.get("./controller/select_data.php", data, function(response) {
                            const libraryMusic = document.querySelector('#data_library');
                            if($(_this).attr('id') == "upLoaded" && response != "empty_data_upload"){
                                load_music( JSON.parse(response),libraryMusic,true);
                                handlePlayMusic(libraryMusic, JSON.parse(response));
                                libraryMusic.setAttribute('category','uploaded');
                            }
                            else if($(_this).attr('id') == "liked" && response != "empty_data_like"){
                                load_music( JSON.parse(response),libraryMusic,true);
                                handlePlayMusic(libraryMusic, JSON.parse(response));
                                libraryMusic.setAttribute('category','liked');
                            }
                            else{
                                $('#data_library').html(`<li>Chưa có bài hát nào được thêm vào hoặc tải lên.</li>`);
                            }
                        });
                    })
            
                    var data1 = {'u_id': u_id,'getPlaylist':'getPlaylist'};
                    jQuery.get("./controller/select_data.php", data1, function(response) {
                        if(response != "empty_data_playlist"){
                            let data =JSON.parse(response);
                            load_playlist_library(data);
                            $('#list_playlist').on('click',function(e){
                                if(e.target.closest('#run_playlist')){
                                        $('#play_music').attr('category','playlist');
                                        let index = Number(e.target.closest('.playlist_item').getAttribute('index'));
                                        var data_hint = {'u_id': uID, 'dataHint':data[index].name_playlist};
                                        jQuery.get("./controller/select_data.php", data_hint, function(response) {
                                            if(response != "empty_data_hint"){
                                                load_music(JSON.parse(response),document.querySelector('.sub_right .hintMusic ul'));
                                                handlePlayMusic(document.querySelector('.sub_right .hintMusic ul'),JSON.parse(response))
            
                                            }
                                            else{
                                                load_music("",document.querySelector('.sub_right .hintMusic ul'));
                                            }
                                        })
                                        $('#playlist_main').addClass('active');
                                        $('#library').css('display','none');
                                        $('#playlist_main .audio img').attr('src',"./uploads/" + data[index].img);
                                        $('#playlist_main .name_playlist').html(`
                                                    <li class="editNameUser">
                                                        <div class="nameUser">
                                                            <input type="text" value="${data[index].name_playlist}" readonly id="name_pl">
                                                        </div>

                                                        <div class="submit">
                                                            <ion-icon name="pencil" id="change_name_pl"></ion-icon>
                                                            <ion-icon name="checkmark-done-circle" id="save_name_pl"></ion-icon>
                                                        </div>
                                                    </li>
                                        `);
                                        // // change name playlist
                                        $("#change_name_pl, #save_name_pl").on('click',function(e){
                                            if($(e.target).attr('id') == "change_name_pl"){
                                            $('#name_pl').attr('readonly',false);
                                            $('#name_pl').css({"background":"white","color":"black"})
                                            $('#change_name_pl').css("display", 'none');
                                            $('#save_name_pl').css("display" , 'block');
                                            }
                                            if($(e.target).attr('id') == "save_name_pl"){
                                                e.preventDefault();
                                                let form_data = new FormData();
                                                let new_name = $("#name_pl").val();
                                                let pl_id = $.cookie('pl_id');
                                                form_data.append('new_name',new_name);
                                                form_data.append('pl_id',pl_id);
                                                $.ajax({
                                                    url: './controller/change_name_pl.php',
                                                    type: 'post',
                                                    data: form_data,
                                                    contentType: false,
                                                    processData: false,
                                                    success: function(res){
                                                    let data = JSON.parse(res);
                                                    if(data.error == 0){
                                                        $("#name_pl").val(data.name)
                                                        $("#snackbar").addClass('show');
                                                        $("#snackbar ion-icon").attr('name','checkmark-done-circle-outline');
                                                        $("#snackbar .text p").html("<p style='color:green'>Thay đổi thành công!</p>");
                                                        setTimeout(()=>{
                                                        $("#snackbar").removeClass("show");
                                                        },1500)
                                                        
                                                        $('#name_pl').attr('readonly',true).css({"background":"transparent","color":"white"})
                                                        $('#change_name_pl').css("display", 'block');
                                                        $('#save_name_pl').css("display" , 'none');
                                                    }
                                                    else{
                                                        $("#name_pl").val(data.name)
                                                        $("#snackbar").addClass('show');
                                                        $("#snackbar ion-icon").attr('name','bug-outline');
                                                        $("#snackbar .text p").html("<p style='color:red'>Thay đổi tên không thành công.</p>");
                                                        setTimeout(()=>{
                                                        $("#snackbar").removeClass("show");
                                                        },1500)                   
                                                    }
                                                    }
                                                });
                                            }
                                        
                                        })


                                        $('#playlist_main .author_playlist').html(`Tạo bởi ${data[index].name}`);
                                        if($('.dateCreate')){
                                            $('.dateCreate').html(`Ngày tạo: ${formatDDMMYY(data[index].date)}`);
                                        }
                                        let pl_id;
                                        if(e.target.closest('.playlist_item')){
                                            pl_id = e.target.closest('.playlist_item').getAttribute('id_playlist');
                                        }
                                        $.cookie('pl_id',pl_id);
                                        let data_get_plItem = {"u_id":uID, "pl_id":pl_id,"action":"getPlaylistItem"};
                                        jQuery.get("./controller/select_data.php", data_get_plItem, function(response) {
                                            let data = "";
                                            if(response != "empty_data_playlistItem"){
                                                data = JSON.parse(response);
                                                document.querySelector('#list_music_playlist').classList.add('active');
                                                document.querySelector('.message_null_playlist').classList.add('active');
                                                load_music(data,document.querySelector('#list_music_playlist ul'),true);
                                                document.querySelector('#list_music_playlist ul').setAttribute('category','playlisted');
                                                handlePlayMusic(document.querySelector('#list_music_playlist ul'),data);
                                            }
                                            else{   
                                                $('.load_list_playlist').html('<li>Không có playlist</li>');
                                            }
                                        })
                                }
                                else if(e.target.closest('#delete_playlist')){
                                        let pl_id  = e.target.closest('#delete_playlist').closest('li').getAttribute('id_playlist');
                                        let _e = e;
                                        $('.confirm_dialog').css("display","flex");
                                        $('.confirm_dialog p').text('Bạn muốn xóa playlist này chứ?');
                                        $('.confirm_dialog button.active a').click(function(e){
                                            e.preventDefault();
                                            $('.confirm_dialog').css("display","none");
                                            _e.target.closest('#delete_playlist').closest('li').remove();
                                            let data = {"u_id":uID, "pl_id":pl_id};
                                            jQuery.ajax({
                                            url: './controller/create_playlist.php',
                                            type: 'POST',
                                            dataType: 'html',
                                            data:  data,
                                            success:function(ketqua) {
                                                if(ketqua == "success"){
                                                    snackbar.classList.add('show');
                                                    snackbar.querySelector('ion-icon').setAttribute('name','checkmark-done-circle-outline');
                                                    snackbar_text.innerHTML = "<p style='color:green'>Xóa playlist thành công!</p>";
                                                    setTimeout(()=>{
                                                    snackbar.classList.remove("show");
                                                    },1500)
                                        
                                                }
                                                else{
                                                    snackbar.classList.add('show');
                                                    snackbar.querySelector('ion-icon').setAttribute('name','bug-outline');
                                                    snackbar_text.innerHTML = "<p style='color:red'>Đã xảy ra lỗi.</p>";
                                                    setTimeout(()=>{
                                                    snackbar.classList.remove("show");
                                                    },1500)
                                    
                                                }
                                            }
                                        });
                                    })   
                                    $('.confirm_dialog button a').click(function(){
                                        $('.confirm_dialog').css("display","none");
                                    })
                                }
            
                            })
                            
                        }
                    });
                });
            }
        }
        

 
    })
    if(window.innerWidth <= 768){
        $('.img_playMusic_mobile').on('click',function(){
            document.querySelector('.musicFixed').classList.add('active'); 
            document.querySelectorAll('ul.music li.song').forEach(item=>{
                item.remove();
            })
            $("main").load('./view/playmusic.php',function(){

                let elem = document.querySelector('.sub_left').getBoundingClientRect();
                document.querySelector('.musicFixed').style.top = elem.top + elem.height + 20 + "px"; 


                $('#play_music').attr('category','playmusic');
                $('.btnPause').addClass('active');
                $('.btnPlay').removeClass('active');
                $('.list_music_playing li > div:first-child ion-icon').css('animationPlayState', 'running');
                $('.play_music .sub_left .runAudio').addClass('active');
                $('.btnPlay').click(function(){
                    audio.play();
                })
                $('.btnPause').click(function(){
                    audio.pause();
    
                })
                load_music_fixed();
                $.get('./controller/select_data.php',{'key':"getAllData"},function(response){
                    if(response != 'empty_data_music'){
                        let data= JSON.parse(response);
                        let filterData = data.filter(data=>{
                            return data.m_id !== currentId;
                        })
                        load_music(data,document.querySelector('#careMusic'));
                        handlePlayMusic(document.querySelector('#careMusic'),data);
                    }
                    else{
                        alert('empty');
                    }
                })
            });
        })
    }
    $('.leftMusicFixed').on('click',function(){
        document.querySelectorAll('ul.music li.song').forEach(item=>{
            item.remove();
        })
        $("main").load('./view/playmusic.php',function(){
            $('#play_music').attr('category','playmusic');
            $('.btnPause').addClass('active');
            $('.btnPlay').removeClass('active');
            $('.list_music_playing li > div:first-child ion-icon').css('animationPlayState', 'running');
            $('.play_music .sub_left .runAudio').addClass('active');
            $('.btnPlay').click(function(){
                audio.play();
            })
            $('.btnPause').click(function(){
                audio.pause();

            })
            load_music_fixed();
            $.get('./controller/select_data.php',{'key':"getAllData"},function(response){
                if(response != 'empty_data_music'){
                    let data= JSON.parse(response);
                    let filterData = data.filter(data=>{
                        return data.m_id !== currentId;
                    })
                    load_music(data,document.querySelector('#careMusic'));
                    handlePlayMusic(document.querySelector('#careMusic'),data);
                }
                else{
                    alert('empty');
                }
            })
        });
    })

    $('main').load('./view/home.php',function(){
        // render home
        const home_music = document.querySelector('.first_home ul');
        const home_music_spotify = document.querySelector('.second_home ul');
        function load_music_home(musics){
            let html = musics.map((music,index)=>{
                    return  `<li class="song" index="${index}" id_song = ${music.m_id}>
                                <a href="#">
                                    <img src="${music.img}" alt="##">
                                    <div class="name">${music.name}</div>
                                    <div class="des">
                                        ${music.artist}
                                    </div>
                                </a>
                                <div><ion-icon name="caret-forward-outline"></ion-icon></div>
                            </li>`
            })
            home_music.innerHTML = html.join("");
            home_music_spotify.innerHTML = html.join("");
            // handle home music
            const list_home_music = document.querySelector('.first_home ul');
            const list_home_music_spotify = document.querySelector('.second_home  ul');
            handlePlayMusic(list_home_music,musics);
            handlePlayMusic(list_home_music_spotify,musics);
        }
        $.get(`./controller/select_data.php?key=getAllData`, {}, function(response) {
            if(response != "empty_data_music" && response != "error"){
                let datas = JSON.parse(response);
                load_music_home(datas);
            }
            else if(response == "empty_data_music"){
                alert('Empty');
            }
            else{
                alert('Error');
            }
        });
    })
      // upload video
  $("#btn-upload-music").click(function(e){
    e.preventDefault();
    let form_data = new FormData();
    let img = $("#fileUploadIcon")[0].files;
    let src = $("#fileUploadMusic")[0].files;
    let name = $("#m_name_up").val();
    let artist = $("#m_artist_up").val();
    let time = $("#m_time_up").val();
    let nation = $("#m_nation_up").val();
    let category = $("#m_category_up").val();


  // Check image selected or not
  if(img.length > 0 && src.length > 0){
      form_data.append('m_img', img[0]);
      form_data.append('m_src', src[0]);
      form_data.append('m_name', name);
      form_data.append('m_artist', artist);
      form_data.append('m_time', time);
      form_data.append('m_nation', nation);
      form_data.append('m_category', category);

      $.ajax({
          url: './controller/upload_video.php',
          type: 'post',
          data: form_data,
          contentType: false,
          processData: false,
          success: function(res){
            let data=JSON.parse(res);
              if (data.error === 0) {
                if(document.getElementById('data_library')){
                    load_music(data.data,document.getElementById('data_library'),true);
                }
                $('#form_upload_music').removeClass('active');
                $('#form_id').trigger("reset");
              }else {
                  alert(data.message);
              }

          }
      });
  
  }else {
    alert("Hãy nhập đầy đủ cả ảnh bài hát và đường dẫn file bài hát.");
  }
});

})


// move admin page
$('#adminPage').click(function(){
    $(location).attr('href','../adm/admin_panel/index.php');
})



// window.addEventListener('resize',e=>{
//     let heightSubleft = document.querySelector('.sub_left').offsetHeight;
//     let top = document.querySelector('.sub_left').offsetTop;
//     console.log(heightSubleft,top);
// })