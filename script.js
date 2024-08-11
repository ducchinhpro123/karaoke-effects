document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");
    audio.play().catch(error => {
        console.log("Auto-play was prevented:", error);
    });
});


// start ------------------AUDIO-----------------------------------

const audio = document.getElementById("audio");
const lyrics = document.querySelectorAll("#lyrics span");
const highlightedWords = new Set();


audio.play().catch(error => {
    console.log("Auto-play was prevented:", error);
    document.getElementById("warning").style.display = "block";
    document.getElementById("playButton").addEventListener("click", () => {
        audio.play();
        counter();

        document.getElementById("warning").style.display = "none";
    });
})

audio.addEventListener("timeupdate", function () {
    const currentTime = audio.currentTime;
    // console.log(audio.currentTime);
    lyrics.forEach((word, index) => {
        const wordTime = parseFloat(word.getAttribute("data-time"));

        const nextWordTime = index < lyrics.length - 1
            ? parseFloat(lyrics[index + 1].getAttribute("data-time"))
            : audio.duration; // If it's the last word, extend until the end of the audio

        const duration = nextWordTime - wordTime; // Calculate duration for the animation

        if (currentTime >= wordTime && currentTime < nextWordTime && !audio.paused) {
            word.classList.add('word'); // Add the 'word' class to start the animation
            word.style.animationDuration = `${duration}s`; // Set animation duration
            highlightedWords.add(word);


        } else if (currentTime > wordTime) {
            word.classList.remove('text-black');
            word.classList.add('text-red');
            word.classList.remove('word'); // Remove the 'word' class to stop the animation
        } else {
            // word.style.color = "black";
            word.classList.add('text-black');
            word.classList.remove('text-red');
            word.classList.remove('word'); // Remove the 'word' class to stop the animation
            // highlightedWords.delete(word);
        }
    });


    // lyrics.forEach(word => {
    //     const wordTime = parseFloat(word.getAttribute("data-time"));
    //
    //     if (highlightedWords.has(word)) {
    //         setTimeout(() => {
    //             word.style.color = "red";
    //         }, wordTime * 1000);
    //     }
    // })
});


audio.play(); // Start playback
// end ------------------AUDIO-----------------------------------

function counter() {

    const counter = document.getElementById("counter");
    let count = 6;

    const countdown = setInterval(() => {
        counter.textContent = count; // Update the div with the current count
        count--;

        if (audio.currentTime > 6) {
            clearInterval(countdown); // Stop the countdown when it reaches 1
            counter.textContent = "";
            return;
        }

        if (count < 0) {
            clearInterval(countdown); // Stop the countdown when it reaches 1
            counter.textContent = "";
        }
    }, 1000); // The countdown updates every 1000 milliseconds (1 second)

}

// set up text to print, each item in array is new line
var aText = new Array(
    "Strangers Again - Cinema"
);
var iSpeed = 100; // time delay of print out
var iIndex = 0; // start printing array at this posision
var iArrLength = aText[0].length; // the length of the text array
var iScrollAt = 20; // start scrolling up at this many lines

var iTextPos = 0; // initialise text position
var sContents = ''; // initialise contents variable
var iRow; // initialise current row

function typewriter() {
    sContents = ' ';
    iRow = Math.max(0, iIndex - iScrollAt);
    var destination = document.getElementById("typedtext");

    while (iRow < iIndex) {
        sContents += aText[iRow++] + '<br />';
    }
    destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
    if (iTextPos++ === iArrLength) {
        iTextPos = 0;
        iIndex++;
        if (iIndex !== aText.length) {
            iArrLength = aText[iIndex].length;
            setTimeout("typewriter()", 500);
        }
    } else {
        setTimeout("typewriter()", iSpeed);
    }
}

// Add event listeners to the lyrics to jump to the corresponding time in the audio
for (let i = 0; i < lyrics.length; i++) {
    lyrics[i].addEventListener("click", function () {
        audio.currentTime = parseFloat(lyrics[i].getAttribute("data-time"));
        if (audio.paused) {
            audio.play();
        }
    });
}

typewriter();

