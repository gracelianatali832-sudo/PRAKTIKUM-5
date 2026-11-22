
/* 1. Ambil elemen yang dibutuhkan */
const isiTabel = document.getElementById("isiTabel");
const inputCari = document.getElementById("cari");
const totalBuku = document.getElementById("totalBuku");
const terpilih = document.getElementById("terpilih");

const formBuku = document.getElementById("formBuku");
const inputJudul = document.getElementById("judul");
const inputPenulis = document.getElementById("penulis");
const inputTahun = document.getElementById("tahun");
const inputStok = document.getElementById("stok");

const kotakError = document.getElementById("pesanError");
const pesanSukses = document.getElementById("pesanSukses");

const tombolMenipis = document.getElementById("tombolMenipis");
const tombolHapus = document.getElementById("hapusTerpilih");

const tombolTambah = formBuku.querySelector('button[type="submit"]');

let jumlahGagal = 0;


/* 2. Perbarui jumlah buku */
function perbaruiTotal() {
    const semuaBaris = isiTabel.querySelectorAll("tr:not([hidden])");
    totalBuku.textContent = "Total judul: " + semuaBaris.length;
}

perbaruiTotal();


/* 3. Cari judul dan penulis */
inputCari.addEventListener("input", function () {
    const kata = inputCari.value.trim().toLowerCase();
    const semuaBaris = isiTabel.querySelectorAll("tr");

    for (let i = 0; i < semuaBaris.length; i++) {
        const judul = semuaBaris[i].cells[0].textContent.toLowerCase();
        const penulis = semuaBaris[i].cells[1].textContent.toLowerCase();

        semuaBaris[i].hidden =
            !judul.includes(kata) && !penulis.includes(kata);
    }

    perbaruiTotal();
});


/* 4. Pilih baris tabel */
isiTabel.addEventListener("click", function (event) {
    const baris = event.target.closest("tr");

    if (baris === null) {
        return;
    }

    const aktif = baris.classList.toggle("dipilih");

    terpilih.textContent = aktif
        ? "Dipilih: " + baris.cells[0].textContent
        : "Dipilih: -";

    /* Hapus pilihan dari baris lain */
    const semuaBaris = isiTabel.querySelectorAll("tr");

    for (let i = 0; i < semuaBaris.length; i++) {
        if (semuaBaris[i] !== baris) {
            semuaBaris[i].classList.remove("dipilih");
        }
    }

    if (aktif) {
        terpilih.textContent =
            "Dipilih: " + baris.cells[0].textContent;
    } else {
        terpilih.textContent = "Dipilih: -";
    }
});


/* 5. Sorot stok menipis */
tombolMenipis.addEventListener("click", function () {
    const semuaBaris = isiTabel.querySelectorAll("tr");

    for (let i = 0; i < semuaBaris.length; i++) {
        const stok = Number(semuaBaris[i].cells[4].textContent);

        semuaBaris[i].classList.toggle("menipis", stok <= 3);
    }
});


/* 6. Hapus baris yang dipilih */
tombolHapus.addEventListener("click", function () {
    const barisDipilih = isiTabel.querySelector("tr.dipilih");

    if (barisDipilih === null) {
        pesanSukses.textContent = "";
        kotakError.innerHTML = "";

        const item = document.createElement("li");
        item.textContent = "Pilih buku yang ingin dihapus.";
        kotakError.appendChild(item);

        return;
    }

    const namaBuku = barisDipilih.cells[0].textContent;

    barisDipilih.remove();

    terpilih.textContent = "Dipilih: -";
    kotakError.innerHTML = "";
    pesanSukses.textContent = "Buku dihapus: " + namaBuku;

    perbaruiTotal();
});


/* 7. Buat baris tabel dari array */
function buatBaris(data) {
    const baris = document.createElement("tr");

    for (let i = 0; i < data.length; i++) {
        const sel = document.createElement("td");
        sel.textContent = data[i];
        baris.appendChild(sel);
    }

    return baris;
}


/* 8. Ambil input dan kotak pesan */
function cekJudulSudahAda(nilai) {
    const semuaBaris = isiTabel.querySelectorAll("tr");

    for (let i = 0; i < semuaBaris.length; i++) {
        const judul = semuaBaris[i].cells[0].textContent;

        if (judul.toLowerCase() === nilai.toLowerCase()) {
            return true;
        }
    }

    return false;
}


/* 9. Pemeriksa judul */
function cekJudul(nilai) {
    if (nilai === "") {
        return "Judul wajib diisi.";
    }

    if (nilai.length < 3) {
        return "Judul minimal 3 karakter.";
    }

    if (cekJudulSudahAda(nilai)) {
        return "Judul sudah ada di katalog.";
    }

    return "";
}


/* 10. Pemeriksa penulis */
function cekPenulis(nilai) {
    if (nilai === "") {
        return "Penulis wajib diisi.";
    }

    if (nilai.length < 3) {
        return "Penulis minimal 3 karakter.";
    }

    /* Nama penulis tidak boleh mengandung angka */
    for (let i = 0; i < nilai.length; i++) {
        if (!isNaN(nilai[i]) && nilai[i] !== " ") {
            return "Penulis tidak boleh mengandung angka.";
        }
    }

    return "";
}


/* 11. Pemeriksa tahun */
function cekTahun(nilai) {
    const angka = Number(nilai);
    const tahunIni = new Date().getFullYear();

    if (nilai === "") {
        return "Tahun wajib diisi.";
    }

    if (!Number.isInteger(angka)) {
        return "Tahun harus berupa angka bulat.";
    }

    if (angka < 1900 || angka > tahunIni) {
        return "Tahun harus antara 1900 dan " + tahunIni + ".";
    }

    return "";
}


/* 12. Pemeriksa stok */
function cekStok(nilai) {
    const angka = Number(nilai);

    if (nilai === "") {
        return "Stok wajib diisi.";
    }

    if (!Number.isInteger(angka)) {
        return "Stok harus berupa angka bulat.";
    }

    if (angka < 0) {
        return "Stok tidak boleh negatif.";
    }

    return "";
}


/* 13. Validasi seluruh form menggunakan satu loop */
function validasiForm() {
    const kolom = [
        { input: inputJudul, cek: cekJudul },
        { input: inputPenulis, cek: cekPenulis },
        { input: inputTahun, cek: cekTahun },
        { input: inputStok, cek: cekStok }
    ];

    const daftarError = [];

    for (let i = 0; i < kolom.length; i++) {
        const pesan = kolom[i].cek(
            kolom[i].input.value.trim()
        );

        kolom[i].input.classList.toggle("salah", pesan !== "");

        if (pesan !== "") {
            daftarError.push(pesan);
        }
    }

    return daftarError;
}


/* 14. Tampilkan pesan error */
function tampilkanError(daftarError) {
    kotakError.innerHTML = "";

    daftarError.forEach(function (pesan) {
        const item = document.createElement("li");
        item.textContent = pesan;
        kotakError.appendChild(item);
    });
}


/* 15. Submit form */
formBuku.addEventListener("submit", function (event) {
    event.preventDefault();

    pesanSukses.textContent = "";

    const daftarError = validasiForm();

    tampilkanError(daftarError);

    /* Jika validasi gagal */
    if (daftarError.length > 0) {
        jumlahGagal++;

        if (jumlahGagal >= 3) {
            tombolTambah.disabled = true;
            tombolTambah.textContent = "Tambah dinonaktifkan";
        }

        return;
    }

    /* Jika data berhasil */
    jumlahGagal = 0;

    const data = [
        inputJudul.value.trim(),
        inputPenulis.value.trim(),
        document.getElementById("kategori").value,
        inputTahun.value.trim(),
        inputStok.value.trim()
    ];

    isiTabel.appendChild(buatBaris(data));

    pesanSukses.textContent = "Buku ditambahkan: " + data[0];

    kotakError.innerHTML = "";

    formBuku.reset();

    const semuaInput = formBuku.querySelectorAll("input");

    for (let i = 0; i < semuaInput.length; i++) {
        semuaInput[i].classList.remove("salah");
    }

    perbaruiTotal();
});
