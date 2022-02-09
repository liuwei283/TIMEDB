document.addEventListener("DOMContentLoaded", () => {
    
    // console.log("fdgfdgdfg");
    // var photos = document.getElementsByClassName("member_photo")
    // for (var j = 0; j < photos.length; j ++ ) {
    //     var memberId = photos[j].id;
    //     photos[j].addEventListener("click", () => {
    //         // var clicked_id = this.id;
    //         console.log(memberId);
    //         var target_id =  memberId + "Details";
    //         var teamIntroBlock = document.getElementById('teamIntro');
    //         teamIntroBlock.style.display = "none";
    //         var memberIntroBlocks = document.getElementsByClassName('memberIntro');
    //         for (var i=0;i<memberIntroBlocks.length;i+=1){
    //             memberIntroBlocks[i].style.display = 'none';
    //         }
    //         var memberIntroBlock = document.getElementById(target_id);
    //         console.log(target_id);
    //         memberIntroBlock.style.display = "block";
    //         // $('#target_id').css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'block');​​​​​​
    //         // ​$('.memberIntro').css("display"​​​​​​​​​​​​​​​​​​​​​​​​​​​,"none");​​​​​​
    //     })
    // }
    // $('#teamIntro').on('click', () => {
    //     var memberIntroBlocks = document.getElementsByClassName('memberIntro');
    //     for (var i=0;i<memberIntroBlocks.length;i+=1){
    //         memberIntroBlocks[i].style.display = 'none';
    //     }
    //     console.log("4egtg")
    //     //$(this).style.display = "block";
    //     var teamIntroBlock = document.getElementById('teamIntro').style.display = "block";
    // });

    $('.member_photo').on('click', (e) => {
        
        var clicked_id = e.target.parentNode.id;
        console.log(clicked_id);
        var target_id =  clicked_id + "Details";
        var teamIntroBlock = document.getElementById('teamDetails');
        teamIntroBlock.style.display = "none";
        var memberIntroBlocks = document.getElementsByClassName('memberDetails');
        for (var i=0;i<memberIntroBlocks.length;i+=1){
            memberIntroBlocks[i].style.display = 'none';
        }
        var memberIntroBlock = document.getElementById(target_id);
        console.log(target_id);
        memberIntroBlock.style.display = "block";
        //memberIntroBlock.style.borderRadius = "50%";
        // $('#target_id').css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'block');​​​​​​
        // ​$('.memberIntro').css("display"​​​​​​​​​​​​​​​​​​​​​​​​​​​,"none");​​​​​​
        
    });
});
