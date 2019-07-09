$(function () {
    $(".content_list").mCustomScrollbar();
    let $audio = $("audio");
    let player = new Player($audio);
    let progress;
    let voiceProgress;
    let lyric;
    //事件委托加载动画
    $(".content_list").delegate(".list_music","mouseenter",function () {
        $(this).find(".list_menu").stop().fadeIn(100);
        $(this).find(".list_time a").stop().fadeIn(100);
        $(this).find(".list_time span").stop().fadeOut(100)
    });
    $(".content_list").delegate(".list_music","mouseleave",function () {
        $(this).find(".list_menu").stop().fadeOut(100);
        $(this).find(".list_time a").stop().fadeOut(100);
        $(this).find(".list_time span").stop().fadeIn(100)
    });
    //处理右部播放列表
    $(".content_list").delegate(".list_check","click",function () {
        $(this).toggleClass("list_checkd")
    });
    let $musicPlay = $(".music_play");
    $(".content_list").delegate(".list_menu_play","click",function () {
        let $item = $(this).parents(".list_music");

        $(this).toggleClass("list_menu_play2");
        $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
        if($(this).attr("class").indexOf("list_menu_play2") !== -1){
            $musicPlay .addClass("music_play2");
            $item.find("div").css("color","#ffff");
            $item.siblings().find("div").css("color","rgba(255,255,255,0.5)")
        }else {
            $musicPlay .removeClass("music_play2");
            $item.find("div").css("color","rgba(255,255,255,0.5)")
        }
        $item.find(".list_number").toggleClass("list_number2");
        $item.siblings().find(".list_number").removeClass("list_number2");

        // 播放音乐
        player.playMusic($item.get(0).index, $item.get(0).music);
        //点击切换歌曲信息
        initMusicInfo($item.get(0).music);
    
        });
    // 监听底部控制区域播放按钮的点击
    $musicPlay.click(function () {
        // 判断有没有播放过音乐
        if(player.currentIndex == -1){
            // 没有播放过音乐
            $(".list_music").eq(0).find(".list_menu_play").trigger("click");
        }else{
            // 已经播放过音乐
            $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
        }
    });

    // 监听底部控制区域上一首按钮的点击
    $(".music_pre").click(function () {
        $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
    });

    // 监听底部控制区域下一首按钮的点击
    $(".music_next").click(function () {
        $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
    });
    //监听删除按钮点击
    $(".content_list").delegate(".list_menu_del","click",function () {
        let $item = $(this).parents(".list_music");
        if($item.get(0).index == player.currentIndex){
            $(".music_next").trigger("click")
        }
        $item.remove();
        player.changeMusic($item.get(0).index);

        //重新排序
        $(".list_music").each(function (index,ele) {
              ele.index = index;
              $(ele).find(".list_number").text(index+1);
        })
    });
    //加载歌曲
    getPlayerList();

    function getPlayerList() {
        $.ajax({
            url: './source/musiclist.json',
            dataType: 'json',
            success: function (data) {
                player.musicList = data;
                let $musicList = $(".content_list ul");
                $.each(data, function (index, ele) {
                    let $item = createMusicItem(index, ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        })

    }

    // 定义一个方法创建一条音乐
    function createMusicItem(index, music) {
         let $item = $("" +
            "<li class=\"list_music\">\n" +
            "<div class=\"list_check\"><i></i></div>\n" +
            "<div class=\"list_number  \">"+(index + 1)+"</div>\n" +
            "<div class=\"list_name\">"+music.name+"" +
            "     <div class=\"list_menu\">\n" +
            "          <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "     </div>\n" +
            "</div>\n" +
            "<div class=\"list_singer\">"+music.singer+"</div>\n" +
            "<div class=\"list_time\">\n" +
            "     <span>"+music.time+"</span>\n" +
            "     <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n" +
            "</div>\n" +
            "</li>");

        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }
    //初始化歌曲
    function initMusicInfo(music) {
            let $musicImage = $(".song_info_pic img");
            let $musicName = $(".song_info_name a");
            let $musicSinger = $(".song_info_singer a");
            let $musicAblum = $(".song_info_ablum a");
            let music_progress_name = $(".music_progress_name");
            let music_progress_time = $(".music_progress_time");
            let mask_bg = $(".mask_bg");
          $musicImage.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        music_progress_name.text(music.name+"/" +music.singer);
        music_progress_time.text("00:00 /" +music.time);
        mask_bg.css(
            "background","url('"+ music.cover+"')"
        )


    }

});