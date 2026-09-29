// --- LOGIKA KLIK TAB ---
// --- LOGIKA BUKA/TUTUP MENU SAMPING ---
function toggleMenu() {
    const sidebar = document.getElementById("sidebarMenu");
    sidebar.classList.toggle("open");
}

// --- LOGIKA KLIK TAB ---
function openTab(id) {
    // Hilangkan status aktif dari semua konten dan tombol
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Tampilkan tab yang dipilih
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');

    // Tutup menu otomatis setelah diklik (Sangat penting untuk HP)
    const sidebar = document.getElementById("sidebarMenu");
    if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
    }
}

// Note: Fungsi logika musik dan game di bawahnya biarkan saja seperti sebelumnya, jangan dihapus.

// --- LOGIKA MUSIK ---
let isPlaying = false;
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerHTML = "🎵 Music: OFF";
        isPlaying = false;
    } else {
        bgMusic.play();
        musicBtn.innerHTML = "🎵 Music: ON";
        isPlaying = true;
    }
}

// --- LOGIKA POP-UP ENSIKLOPEDIA ---
function bukaPopup(kartu) {
    // Ambil isi kartu
    const gambar = kartu.querySelector('img').src;
    const judul = kartu.querySelector('h3').innerText;
    const deskripsi = kartu.querySelector('p').innerText;

    // Masukkan ke Pop-Up
    document.getElementById('gambarPopup').src = gambar;
    document.getElementById('judulPopup').innerText = judul;
    document.getElementById('teksPopup').innerText = deskripsi;

    // Tampilkan Pop-Up
    document.getElementById('kotakPopup').style.display = 'flex';
}

function tutupPopup() {
    // Sembunyikan Pop-Up
    document.getElementById('kotakPopup').style.display = 'none';
}

// --- MESIN GAME: NETMASTER TIME ATTACK ---

// Bank Soal Jaringan
const bankSoal = [
    { q: "Standar urutan pin TIA/EIA-568B dimulai dengan warna?", o: ["Putih Hijau", "Putih Orange", "Biru", "Coklat"], a: 1 },
    { q: "Perangkat Layer 3 yang menghubungkan IP berbeda adalah?", o: ["Switch", "Hub", "Router", "Modem"], a: 2 },
    { q: "Protokol yang memberikan IP secara otomatis disebut?", o: ["DNS", "DHCP", "FTP", "HTTP"], a: 1 },
    { q: "Berapa kecepatan maksimal kabel Cat5e?", o: ["100 Mbps", "1 Gbps", "10 Gbps", "100 Gbps"], a: 1 },
    { q: "Ping menggunakan protokol jaringan apa?", o: ["TCP", "UDP", "ICMP", "ARP"], a: 2 },
    { q: "Cisco Packet Tracer adalah software untuk?", o: ["Edit Video", "Simulasi Jaringan", "Database", "Desain Web"], a: 1 },
    { q: "Topologi jaringan yang menggunakan satu kabel utama (backbone) adalah?", o: ["Star", "Ring", "Bus", "Mesh"], a: 2 }
];

let gameTimer;
let timeLeft = 30;
let currentScore = 0;
let activeQuestion = {};

// Menampilkan Leaderboard saat web dibuka
document.addEventListener("DOMContentLoaded", renderLeaderboard);

function startGame() {
    document.getElementById("game-menu").style.display = "none";
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-play").style.display = "block";
    
    timeLeft = 30;
    currentScore = 0;
    document.getElementById("timer-bar").style.width = "100%";
    document.getElementById("timer-bar").style.backgroundColor = "var(--emerald-green)";
    
    nextQuestion();
    
    // Mulai Timer Mundur
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("time-text").innerText = timeLeft + "s";
        
        // Animasi bar mengecil
        let percentage = (timeLeft / 30) * 100;
        document.getElementById("timer-bar").style.width = percentage + "%";
        
        // Ubah warna bar jika waktu mau habis
        if (timeLeft <= 10) document.getElementById("timer-bar").style.backgroundColor = "red";
        
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function nextQuestion() {
    // Ambil soal acak
    const randomIndex = Math.floor(Math.random() * bankSoal.length);
    activeQuestion = bankSoal[randomIndex];
    
    document.getElementById("question-text").innerText = activeQuestion.q;
    const btns = document.querySelectorAll(".option-btn");
    
    for (let i = 0; i < 4; i++) {
        btns[i].innerText = activeQuestion.o[i];
    }
}

function checkAnswer(selectedIndex) {
    if (selectedIndex === activeQuestion.a) {
        currentScore += 100; // Tambah skor jika benar
    } else {
        currentScore -= 20; // Kurangi skor jika salah (bikin lebih greget!)
        if (currentScore < 0) currentScore = 0;
    }
    nextQuestion(); // Langsung ganti soal tanpa henti
}

function endGame() {
    clearInterval(gameTimer);
    document.getElementById("game-play").style.display = "none";
    document.getElementById("game-over").style.display = "block";
    document.getElementById("final-score").innerText = currentScore;
}

function saveScore() {
    const name = document.getElementById("playerName").value || "Anonim";
    
    // Ambil data skor lama dari browser, atau buat array kosong & data dummy jika baru pertama kali
    let leaderboard = JSON.parse(localStorage.getItem("netMasterScores")) || [
        { name: "Siswa SMK", score: 800 },
        { name: "Pro Teknik", score: 650 },
        { name: "Pemula Network", score: 400 }
    ];
    
    // Masukkan skor baru
    leaderboard.push({ name: name, score: currentScore });
    
    // Urutkan dari tertinggi ke terendah
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Simpan maksimal top 10 saja agar rapi
    leaderboard = leaderboard.slice(0, 10);
    
    // Simpan kembali ke memori browser
    localStorage.setItem("netMasterScores", JSON.stringify(leaderboard));
    
    resetGameMenu();
}

function resetGameMenu() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-menu").style.display = "block";
    document.getElementById("playerName").value = "";
    renderLeaderboard();
}

function renderLeaderboard() {
    const tbody = document.getElementById("leaderboard-body");
    // Gunakan data dummy jika belum ada data sama sekali
    const leaderboard = JSON.parse(localStorage.getItem("netMasterScores")) || [
        { name: "Siswa IT", score: 800 },
        { name: "Pro Teknik", score: 650 },
        { name: "Pemula Network", score: 400 }
    ];
    
    tbody.innerHTML = "";
    
    leaderboard.forEach((entry, index) => {
        let medal = "";
        if (index === 0) medal = "🥇 ";
        else if (index === 1) medal = "🥈 ";
        else if (index === 2) medal = "🥉 ";
        
        tbody.innerHTML += `
            <tr>
                <td>${medal} #${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
            </tr>
        `;
    });
}