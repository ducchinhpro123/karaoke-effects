
// function removeText() {
//     document.getElementById("clickText").innerHTML = "<span class=\"word\" data-text=\"Remember that piano\" data-time=\"37\">Remember that piano</span>";
// }

document.addEventListener("DOMContentLoaded", function () {


    console.log("%cENJOY THE MUSIC", "color: blue; font-size: 40px; font-weight: bold; background-color: yellow; padding: 5px;");

    const audio = document.getElementById("audio");
    const lyrics = document.querySelectorAll("#lyrics span");
    // const highlightedWords = new Set();

    const fullSrc = audio.src;
    const fileName = fullSrc.split("/").pop();
    const encodedFileName = fileName.replace(/%20/g, " ").split(".")[0];


    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            event.preventDefault();
            if (audio.paused) {
                document.getElementById("warning").style.display = "none";
                audio.play();
            } else {
                audio.pause();
            }
        }
    });

    function playAudio() {
        audio.play().then(() => {
            // removeText();
        })
            .catch(error => {
                console.log("Auto-play was prevented:", error);
                document.getElementById("warning").style.display = "block";
                if (audio.paused) {
                    document.getElementById("playButton").addEventListener("click", () => {
                        audio.play();
                        document.getElementById("warning").style.display = "none";
                    });
                }
            });

        if (!audio.paused) {
            document.getElementById("warning").style.display = "none";
        }
    }

    function updateLyrics() {
        const currentTime = audio.currentTime;
        lyrics.forEach((word, index) => {
            const wordTime = parseFloat(word.getAttribute("data-time"));
            const nextWordTime = index < lyrics.length - 1
                ? parseFloat(lyrics[index + 1].getAttribute("data-time"))
                : audio.duration;
            const duration = nextWordTime - wordTime;

            if (currentTime >= wordTime && currentTime < nextWordTime) {
                word.classList.add('word');
                word.style.setProperty('--animation-duration', `${duration}s`);

                if (audio.paused) {
                    // console.log("Paused");
                    word.style.setProperty('animation-delay', `${duration}s`);
                    word.style.setProperty('--animation-play-state', 'paused');
                } else {
                    word.style.setProperty('--animation-play-state', 'running');
                }

                // highlightedWords.add(word);
            } else if (currentTime > wordTime) {
                word.classList.remove('text-black');
                word.classList.add('text-red');
                word.classList.remove('word');
            } else {
                word.classList.add('text-black');
                word.classList.remove('text-red');
                word.classList.remove('word');
            }
        });
    }

    function typewriter(songName) {
        // console.log(songName);
        const aText = [songName];
        let iSpeed = 100;
        let iIndex = 0;
        let iArrLength = aText[0].length;
        let iScrollAt = 20;
        let iTextPos = 0;
        let sContents = '';
        let iRow;

        function type() {
            sContents = ' ';
            iRow = Math.max(0, iIndex - iScrollAt);
            const destination = document.getElementById("typedtext");

            while (iRow < iIndex) {
                sContents += aText[iRow++] + '<br />';
            }
            destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
            if (iTextPos++ === iArrLength) {
                iTextPos = 0;
                iIndex++;
                if (iIndex !== aText.length) {
                    iArrLength = aText[iIndex].length;
                    setTimeout(type, 500);
                }
            } else {
                setTimeout(type, iSpeed);
            }
        }

        type();
    }


    audio.addEventListener("timeupdate", updateLyrics);
    lyrics.forEach(word => {
        word.addEventListener("click", () => {
            audio.currentTime = parseFloat(word.getAttribute("data-time"));
            if (audio.paused) {
                playAudio();
            }
        });
    });

    playAudio();
    // setInterval(function () {
    //     typewriter(encodedFileName);
    // }, 5000)
    typewriter(encodedFileName);
});

