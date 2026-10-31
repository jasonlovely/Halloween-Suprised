(function () {
    const sky = document.getElementById("sky");
    for (let i = 0; i < 42; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 70 + "%";
        star.style.animationDelay = (Math.random() * 2.4) + "s";
        star.style.animationDuration = (1.6 + Math.random() * 2) + "s";
        sky.appendChild(star);
    }
    for (let i = 0; i < 14; i++) {
        const spark = document.createElement("div");
        spark.className = "sparkle";
        spark.style.left = Math.random() * 100 + "%";
        spark.style.bottom = Math.random() * 20 + "px";
        spark.style.animationDelay = (Math.random() * 3.5) + "s";
        spark.style.animationDuration = (2.8 + Math.random() * 2.5) + "s";
        sky.appendChild(spark);
    }
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");
    let pieces = [];
    let confettiOn = false;
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();
    function burst() {
        const emojis = ["💗", "🧡", "✨", "🎃", "🦇", "👻", "💌"];
        for (let i = 0; i < 48; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 9,
                vy: Math.random() * -8 - 2,
                g: 0.12 + Math.random() * 0.08,
                emoji: emojis[i % emojis.length],
                rot: Math.random() * 6,
                vr: (Math.random() - 0.5) * 0.2,
                life: 160 + Math.random() * 40
            });
        }
        confettiOn = true;
    }
    function tick() {
        if (confettiOn) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "22px serif";
            pieces = pieces.filter(function (p) {
                p.vy += p.g;
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vr;
                p.life -= 1;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.globalAlpha = Math.max(p.life / 180, 0);
                ctx.fillText(p.emoji, 0, 0);
                ctx.restore();
                return p.life > 0 && p.y < canvas.height + 40;
            });
            if (!pieces.length) confettiOn = false;
        }
        requestAnimationFrame(tick);
    }
    tick();
    let audioCtx;
    let musicOn = false;
    const oscillators = [];
    const song = document.getElementById("song");
    song.src = "song.mp3";
    function startGeneratedMusic() {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
        const master = audioCtx.createGain();
        master.gain.value = 0.045;
        master.connect(audioCtx.destination);
        notes.forEach(function (freq, i) {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            g.gain.value = 0;
            osc.connect(g);
            g.connect(master);
            osc.start();
            const now = audioCtx.currentTime;
            const beat = 1.15;
            function loopGain(t) {
                g.gain.setValueAtTime(0, t + i * beat);
                g.gain.linearRampToValueAtTime(1, t + i * beat + 0.2);
                g.gain.linearRampToValueAtTime(0, t + i * beat + 0.9);
            }
            for (let n = 0; n < 24; n++) loopGain(now + n * notes.length * beat);
            oscillators.push(osc);
        });
    }
    document.getElementById("musicBtn").addEventListener("click", function () {
        if (musicOn) return;
        musicOn = true;
        this.textContent = "Music is playing 💜";
        const playPromise = song.play();
        if (playPromise && typeof playPromise.then === "function") {
            playPromise.catch(function () {
                startGeneratedMusic();
            });
        } else {
            startGeneratedMusic();
        }
    });
    document.getElementById("openBtn").addEventListener("click", function () {
        document.getElementById("secret-message").classList.add("show");
        this.style.display = "none";
        burst();
    });
    document.getElementById("moreBtn").addEventListener("click", function () {
        document.getElementById("second-surprise").classList.add("show");
        this.style.display = "none";
        burst();
    });
})();
