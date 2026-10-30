const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const skorTeks = document.getElementById("skor");
const koinTeks = document.getElementById("koin");
const layarMulai = document.getElementById("mulai");

let pemain;
let rintangan = [];
let koin = [];
let skor = 0;
let jumlahKoin = 0;
let kecepatan = 4;
let frame = 0;
let aktif = false;
let waktuLompat = 0;
let waktuGeser = 0;
let pesan = "";

function mulaiGame() {
    pemain = {
        jalur: 1,
        y: 475
    };

    rintangan = [];
    koin = [];
    skor = 0;
    jumlahKoin = 0;
    kecepatan = 4;
    frame = 0;
    waktuLompat = 0;
    waktuGeser = 0;
    pesan = "";
    aktif = true;

    skorTeks.textContent = 0;
    koinTeks.textContent = 0;
    layarMulai.style.display = "none";
}

function posisiJalur(jalur, y) {
    const lebar = 100 + y * 0.12;
    const tengah = 200 + (jalur - 1) * lebar;

    return tengah;
}

function gambarLatar() {
    // Langit
    const langit = ctx.createLinearGradient(0, 0, 0, 600);
    langit.addColorStop(0, "#42b8ff");
    langit.addColorStop(1, "#e5f7ff");

    ctx.fillStyle = langit;
    ctx.fillRect(0, 0, 400, 600);

    // Pepohonan
    for (let i = 0; i < 8; i++) {
        const x = i * 65 - 20;
        const y = 140 + ((frame * 1.5 + i * 45) % 160);

        ctx.fillStyle = "#348747";
        ctx.beginPath();
        ctx.moveTo(x, y + 70);
        ctx.lineTo(x + 25, y);
        ctx.lineTo(x + 50, y + 70);
        ctx.fill();
    }

    // Jalan perspektif
    ctx.fillStyle = "#51545c";
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(300, 0);
    ctx.lineTo(400, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();

    // Garis jalan
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.setLineDash([25, 20]);
    ctx.lineDashOffset = -frame * 3;

    ctx.beginPath();
    ctx.moveTo(166, 0);
    ctx.lineTo(133, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(234, 0);
    ctx.lineTo(267, 600);
    ctx.stroke();

    ctx.setLineDash([]);

    // Garis pinggir jalan
    ctx.strokeStyle = "#ffcf4b";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(0, 600);
    ctx.moveTo(300, 0);
    ctx.lineTo(400, 600);
    ctx.stroke();
}

function gambarNinja(x, y) {
    const melompat = waktuLompat > 0;
    const meluncur = waktuGeser > 0;

    // Bayangan
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(
        x, melompat ? 550 : 535,
        melompat ? 18 : 25, 7, 0, 0, Math.PI * 2
    );
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);

    if (meluncur) {
        ctx.rotate(-0.12);

        // Badan meluncur
        ctx.fillStyle = "#ff791e";
        ctx.fillRect(-23, -17, 46, 25);

        // Kepala
        ctx.fillStyle = "#f4bb8c";
        ctx.beginPath();
        ctx.arc(23, -13, 15, 0, Math.PI * 2);
        ctx.fill();

        // Rambut kuning
        ctx.fillStyle = "#ffdf35";
        ctx.beginPath();
        ctx.moveTo(10, -22);
        ctx.lineTo(6, -38);
        ctx.lineTo(19, -30);
        ctx.lineTo(27, -39);
        ctx.lineTo(30, -26);
        ctx.lineTo(40, -30);
        ctx.lineTo(36, -15);
        ctx.closePath();
        ctx.fill();

        // Ikat kepala
        ctx.fillStyle = "#3558bb";
        ctx.fillRect(10, -25, 24, 6);

        // Kaki
        ctx.fillStyle = "#2444a0";
        ctx.fillRect(-17, 5, 23, 8);
    } else {
        // Kaki
        ctx.fillStyle = "#2444a0";
        ctx.fillRect(-15, 22, 12, 22);
        ctx.fillRect(4, 22, 12, 22);

        // Sepatu
        ctx.fillStyle = "#222";
        ctx.fillRect(-18, 39, 17, 7);
        ctx.fillRect(3, 39, 18, 7);

        // Badan oranye
        ctx.fillStyle = "#ff791e";
        ctx.fillRect(-19, -7, 38, 34);

        // Ritsleting
        ctx.strokeStyle = "#fff0c5";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.lineTo(0, 23);
        ctx.stroke();

        // Kepala
        ctx.fillStyle = "#f4bb8c";
        ctx.beginPath();
        ctx.arc(0, -22, 18, 0, Math.PI * 2);
        ctx.fill();

        // Rambut runcing
        ctx.fillStyle = "#ffdf35";
        ctx.beginPath();
        ctx.moveTo(-18, -30);
        ctx.lineTo(-23, -46);
        ctx.lineTo(-10, -38);
        ctx.lineTo(-6, -52);
        ctx.lineTo(3, -39);
        ctx.lineTo(14, -49);
        ctx.lineTo(13, -35);
        ctx.lineTo(22, -38);
        ctx.lineTo(15, -24);
        ctx.closePath();
        ctx.fill();

        // Ikat kepala
        ctx.fillStyle = "#3558bb";
        ctx.fillRect(-17, -34, 34, 7);

        // Pelat kepala
        ctx.fillStyle = "#b9c5d3";
        ctx.fillRect(-5, -33, 11, 5);

        // Mata
        ctx.fillStyle = "#222";
        ctx.fillRect(-10, -24, 5, 4);
        ctx.fillRect(5, -24, 5, 4);

        // Garis pipi
        ctx.strokeStyle = "#8e482e";
        ctx.lineWidth = 1.5;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(-15, -17 + i * 4);
            ctx.lineTo(-8, -16 + i * 4);
            ctx.moveTo(8, -16 + i * 4);
            ctx.lineTo(15, -17 + i * 4);
            ctx.stroke();
        }
    }

    ctx.restore();
}

function tambahObjek() {
    if (frame % 65 === 0) {
        const jalur = Math.floor(Math.random() * 3);

        rintangan.push({
            jalur: jalur,
            y: -40,
            ukuran: 1,
            jenis: Math.random() < 0.5 ? "kotak" : "palang"
        });
    }

    if (frame % 35 === 0) {
        const jalur = Math.floor(Math.random() * 3);

        koin.push({
            jalur: jalur,
            y: -20,
            diambil: false
        });
    }
}

function gerakkanObjek() {
    rintangan.forEach(r => r.y += kecepatan);
    koin.forEach(k => k.y += kecepatan);

    rintangan = rintangan.filter(r => r.y < 650);
    koin = koin.filter(k => k.y < 650 && !k.diambil);
}

function gambarObjek() {
    rintangan.forEach(r => {
        const x = posisiJalur(r.jalur, r.y);
        const ukuran = 20 + r.y * 0.055;

        if (r.jenis === "kotak") {
            ctx.fillStyle = "#a84a24";
            ctx.fillRect(
                x - ukuran, r.y,
                ukuran * 2, ukuran * 1.6
            );

            ctx.strokeStyle = "#ffbd69";
            ctx.lineWidth = 3;
            ctx.strokeRect(
                x - ukuran, r.y,
                ukuran * 2, ukuran * 1.6
            );

            ctx.fillStyle = "#f4d2a0";
            ctx.font = `${Math.max(12, ukuran * 0.6)}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText("!", x, r.y + ukuran);
        } else {
            // Palang yang harus dihindari dengan meluncur
            ctx.fillStyle = "#e53b38";
            ctx.fillRect(
                x - ukuran * 1.4,
                r.y,
                ukuran * 2.8,
                ukuran * 0.45
            );

            ctx.fillStyle = "#fff";
            ctx.fillRect(
                x - ukuran * 1.4,
                r.y,
                ukuran * 2.8,
                4
            );
        }
    });

    koin.forEach(k => {
        const x = posisiJalur(k.jalur, k.y);
        const ukuran = 9 + k.y * 0.015;

        ctx.fillStyle = "#ffdf24";
        ctx.beginPath();
        ctx.ellipse(
            x, k.y, ukuran * 0.75,
            ukuran, 0, 0, Math.PI * 2
        );
        ctx.fill();

        ctx.strokeStyle = "#e58b00";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#fff4a0";
        ctx.fillRect(x - 2, k.y - ukuran / 2, 3, ukuran);
    });
}

function periksaTabrakan() {
    const jalurPemain = pemain.jalur;

    rintangan = rintangan.filter(r => {
        if (
            r.jalur === jalurPemain &&
            r.y > 440 && r.y < 535
        ) {
            const amanLompat =
                waktuLompat > 0 && r.jenis === "kotak";

            const amanGeser =
                waktuGeser > 0 && r.jenis === "palang";

            if (!amanLompat && !amanGeser) {
                aktif = false;
                pesan = "GAME OVER!";
                layarMulai.querySelector("h2").textContent = pesan;
                layarMulai.querySelector("p").textContent =
                    "Skor kamu: " + skor;
                document.getElementById("btnMulai").textContent =
                    "MAIN LAGI";
                layarMulai.style.display = "flex";
            }

            return false;
        }

        return true;
    });

    koin.forEach(k => {
        if (
            k.jalur === jalurPemain &&
            k.y > 455 && k.y < 535 &&
            !k.diambil
        ) {
            k.diambil = true;
            jumlahKoin++;
            skor += 10;

            koinTeks.textContent = jumlahKoin;
            skorTeks.textContent = skor;
        }
    });
}

function gambarGame() {
    gambarLatar();
    gambarObjek();

    const x = posisiJalur(pemain.jalur, 500);
    const y = waktuLompat > 0 ? 425 : 485;

    gambarNinja(x, y);
}

function putaran() {
    if (aktif) {
        frame++;
        skor++;
        kecepatan = Math.min(9, 4 + frame / 1500);

        if (waktuLompat > 0) waktuLompat--;
        if (waktuGeser > 0) waktuGeser--;

        if (frame % 8 === 0) {
            skorTeks.textContent = skor;
        }

        tambahObjek();
        gerakkanObjek();
        periksaTabrakan();
    }

    gambarGame();
    requestAnimationFrame(putaran);
}

function pindahJalur(arah) {
    if (!aktif) return;

    pemain.jalur += arah;
    pemain.jalur = Math.max(0, Math.min(2, pemain.jalur));
}

function lompat() {
    if (aktif && waktuLompat === 0 && waktuGeser === 0) {
        waktuLompat = 45;
    }
}

function meluncur() {
    if (aktif && waktuGeser === 0 && waktuLompat === 0) {
        waktuGeser = 35;
    }
}

document.getElementById("kiri").onclick = () => pindahJalur(-1);
document.getElementById("kanan").onclick = () => pindahJalur(1);
document.getElementById("lompat").onclick = lompat;
document.getElementById("geser").onclick = meluncur;

document.getElementById("btnMulai").onclick = () => {
    mulaiGame();
};

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "a") pindahJalur(-1);
    if (e.key === "ArrowRight" || e.key === "d") pindahJalur(1);
    if (e.key === "ArrowUp" || e.key === " ") lompat();
    if (e.key === "ArrowDown") meluncur();
});

mulaiGame();
aktif = false;
layarMulai.style.display = "flex";
putaran();