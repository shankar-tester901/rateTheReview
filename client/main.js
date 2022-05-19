var pubnub = new PubNub({
    subscribeKey: 'sub-c-eed8fad4-aed2-11ea-adee-16aa024ec639',
    publishKey: 'pub-c-bc0fe853-30bd-41ea-bd21-83bc9d68da1c',
});
var count = 0;
var rowId = 0;
var tableOne = document.getElementById("myTable");
var input = document.getElementById("input");
var channel = 'partnerchat';

// Subscribe to a channel
pubnub.subscribe({
    channels: [channel]
});


$("#slideshow > div:gt(0)").hide();

setInterval(function() {
    $('#slideshow > div:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#slideshow');
}, 3000);

// Listen to message events
pubnub.addListener({
    message: function(m) {
        // Add message to page
        //    console.log('>>>>>>  ' + m.message + '  count   ' + count);

        var row = tableOne.insertRow(count);
        row.setAttribute("id", rowId);
        var cell0 = row.insertCell(0);

        var cell_Info = {
            message: m.message,
            thumb: "<img src=./images/default.png" + " width=\"30\"; height:\"30\";>",
        };
        cell0.innerHTML = cell_Info.message;

        var cell1 = row.insertCell(1);
        cell1.innerHTML = cell_Info.thumb;
        //get the score and update the image accordingly using jquery or javascript
        getSentimentScore(cell_Info.message, rowId);

        count = count + 1;
        rowId = rowId + 1;
    }
});

input.addEventListener('keypress', function(e) {
    input.addEventListener('keypress', function(e) {
        if ((e.keyCode || e.charCode) == 13) {
            var str = $("#input").val();
            pubnub.publish({
                channel: channel,
                message: input.value,
                x: (input.value = '')
            });
        }

    })
})





function getSentimentScore(reco, rowId) {
    //  alert('Term is ' + reco);
    $.ajax({
        type: 'POST',
        url: '/server/rate_the_review_partners_function/getSentimentReview',
        contentType: 'application/json;charset=UTF-16',
        data: JSON.stringify({
            "rate_sentence": reco
        }),
        success: function(serverData) {
            //   alert(serverData);
            var jsonData = JSON.parse(serverData);
            var emotionNum = JSON.stringify(jsonData.data.items[0].emotion);
            //get the specific row based on rowId and update the image
            var img = $("#" + rowId).find("img");
            // console.log(img.attr("src"));
            // console.log(emotionNum);

            if (emotionNum == 0) {
                console.log('anger');
                img.attr("src", "images/angry.png");
            } else if (emotionNum == 1) {
                console.log('disappointment');
                img.attr("src", "images/disappointed.png");
            } else if (emotionNum == 2) {
                console.log('sarcasm');
                img.attr("src", "images/sarcasm.jpeg");
            } else if (emotionNum == 3) {
                console.log('neutral');
                img.attr("src", "images/neutral.png");
            } else if (emotionNum == 4) {
                console.log('happy');
                img.attr("src", "images/happy.png");
            } else if (emotionNum == 5) {
                console.log('extremely happy');
                img.attr("src", "images/vhappy.png");
            }


        },
        error: function(error) {
            //   $('#recoFromServer').text(error);
            alert("Error received from Server :" + error);
        }
    });
};