document.addEventListener('DOMContentLoaded', () => {
    generateMatrixInput();
});
// Menambahkan event listener yang akan memanggil fungsi generateMatrixInput ketika dokumen HTML selesai dimuat


// mengambil nilai order (ordo) dari elemen HTML dengan ID 'order'
// Mengosongkan elemen div dengan ID 'matrix',yg lama agar langkah-langkah baru yang relevan ditampilkan

function generateMatrixInput() {
    const order = document.getElementById('order').value;
    const matrixDiv = document.getElementById('matrix');
    matrixDiv.innerHTML = '';

    // menghasilkan elemen-elemen input yang mewakili matriks dan menampilkannya dalam bentuk baris dan kolom
    // menentukan ordo (ukuran) dari matriks
    for (let i = 0; i < order; i++) {
        const row = document.createElement('div');
        row.classList.add('matrix-row');
        
        for (let j = 0; j < order; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `a${i}${j}`;
            input.placeholder = `a${i + 1}${j + 1}`;
            row.appendChild(input);
        }
        // mengumpulkan semua elemen input dalam satu baris.
      

     // Membuat input untuk setiap elemen matriks dan elemen hasil (b).
        const bInput = document.createElement('input');
        bInput.type = 'number';
        bInput.id = `b${i}`;
        bInput.placeholder = `b${i + 1}`;
        row.appendChild(bInput);
        matrixDiv.appendChild(row);
    }
  // acr induk akan menampung seluruh matriks.

//   mencari elemen HTML yang memiliki atribut id dengan nilai solutions.
//   Mengakses elemen div yang akan digunakan untuk menampilkan hasil perhitungan atau solusi.
    const solutionsDiv = document.getElementById('solutions');
    solutionsDiv.innerHTML = '';
    
    // membuat paragraf kosong untuk menampilkan solusi yang dihitung 
    // x$ Memberikan id unik pada elemen <p> berdasarkan indeks iterasi i.
    for (let i = 0; i < order; i++) {
        const solutionP = document.createElement('p');
        solutionP.id = `x${i + 1}-gauss`;
        solutionsDiv.appendChild(solutionP);

        const solutionPJordan = document.createElement('p');
        solutionPJordan.id = `x${i + 1}-gauss-jordan`;
        solutionsDiv.appendChild(solutionPJordan);
    }
}
// apnd Menambahkan elemen <p> yang baru dibuat ke dalam elemen div dengan id solutions.



// menerima satu parameter method, yang menentukan metode penyelesaian yang akan digunakan
// [Inisialisasi Array, menyimpan matrix dan const hasil
function compute(method) { 
    const order = parseInt(document.getElementById('order').value);
    const matrix = [];
    const results = [];

   
    for (let i = 0; i < order; i++) {
        const row = [];
        for (let j = 0; j < order; j++) {
            row.push(parseFloat(document.getElementById(`a${i}${j}`).value));
        }
         // Mengambil elemen input yang memiliki id aij

        matrix.push(row);
        results.push(parseFloat(document.getElementById(`b${i}`).value));
    }
    // Menambahkan array row (yang berisi satu baris dari matriks) ke array matrix.
    // dari elemen input dengan id bi, mengkonversinya menjadi float, dan menambahkannya ke array results.


    // memanggil metode eliminasi yang sesuai.
    if (method === 'gauss') {
        gaussElimination(matrix, results);
    } else if (method === 'gauss-jordan') {
        gaussJordanElimination(matrix, results);
    }
}

// Melakukan eliminasi Gauss untuk mengubah matriks menjadi bentuk segitiga atas
// pivot, Perulangan untuk Menghilangkan Elemen di Bawah Pivot, 
// memodifikasi elemen-elemen dalam baris i mulai dari kolom k(pivot) hingga kolom terakhir 
function gaussElimination(matrix, results) {
    const stepsDiv = document.getElementById('gauss-steps');
    stepsDiv.innerHTML = '';

    const order = matrix.length;
    for (let k = 0; k < order; k++) {
        for (let i = k + 1; i < order; i++) {
            const factor = parseFloat((matrix[i][k] / matrix[k][k]).toFixed(1));
            for (let j = k; j < order; j++) {
                matrix[i][j] = parseFloat((matrix[i][j] - factor * matrix[k][j]).toFixed(1));
            }
            results[i] = parseFloat((results[i] - factor * results[k]).toFixed(1));
            // Menampilkan setiap langkah eliminasi dengan memanggil displayStep.
            displayStep(matrix, results, stepsDiv, `R${i + 1} -> R${i + 1} - (${factor.toFixed(1)})R${k + 1}`, matrix[k][k]);
        }
    }

    // melakukan substitusi mundur untuk menemukan solusi.
    const solution = backSubstitution(matrix, results);
    displaySolution(solution, 'gauss');
}

// mengubah matriks menjadi bentuk identitas.
function gaussJordanElimination(matrix, results) {
    const stepsDiv = document.getElementById('gauss-jordan-steps');
    stepsDiv.innerHTML = '';

    const order = matrix.length;
    for (let k = 0; k < order; k++) {
        const pivot = matrix[k][k];
        for (let j = k; j < order; j++) {
            matrix[k][j] = parseFloat((matrix[k][j] / pivot).toFixed(1));
        }
        results[k] = parseFloat((results[k] / pivot).toFixed(1));
        displayStep(matrix, results, stepsDiv, `R${k + 1} -> R${k + 1} / (${pivot.toFixed(1)})`, pivot);
        
        for (let i = 0; i < order; i++) {
            if (i !== k) {
                const factor = matrix[i][k];
                for (let j = k; j < order; j++) {
                    matrix[i][j] = parseFloat((matrix[i][j] - factor * matrix[k][j]).toFixed(1));
                }
                results[i] = parseFloat((results[i] - factor * results[k]).toFixed(1));

                // Menampilkan setiap langkah eliminasi dengan memanggil displayStep.
                displayStep(matrix, results, stepsDiv, `R${i + 1} -> R${i + 1} - (${factor.toFixed(1)})R${k + 1}`, pivot);
            }
        }
    }

    // Solusi diperoleh langsung dari vektor hasil setelah matriks menjadi identitas
    const solution = results;
    displaySolution(solution, 'gauss-jordan');
}

// Melakukan substitusi mundur pada matriks yang sudah dalam bentuk segitiga atas untuk menemukan solusi.
function backSubstitution(matrix, results) {
    const order = matrix.length;
    const solution = Array(order).fill(0);

    for (let i = order - 1; i >= 0; i--) {
        let sum = results[i];
        for (let j = i + 1; j < order; j++) {
            sum -= matrix[i][j] * solution[j];
        }
        solution[i] = parseFloat((sum / matrix[i][i]).toFixed(1));
    }

    return solution;
}

// ..Memperbarui elemen HTML dengan ID yang sesuai dengan metode untuk menampilkan solusi yang telah dihitung.
// Menggunakan format 
// properti untunk mendapatkan teks di dalam elemen HTML.

function displaySolution(solution, method) {
    for (let i = 0; i < solution.length; i++) {
        document.getElementById(`x${i + 1}-${method}`).innerText = `x${i + 1} = ${solution[i]}`;
    }
}


// Menampilkan langkah-langkah eliminasi dalam bentuk tabel, termasuk operasi yang dilakukan dan nilai pivot.
// Setiap langkah ditampilkan dalam div baru yang ditambahkan ke stepsDiv
function displayStep(matrix, results, stepsDiv, operation, pivot) {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step');

    const operationP = document.createElement('p');
    operationP.innerText = `${operation} (Pivot: ${pivot.toFixed(1)})`;
    stepDiv.appendChild(operationP);

    const table = document.createElement('table');
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('td');
            cell.innerText = matrix[i][j].toFixed(1);
            row.appendChild(cell);
        }
        const resultCell = document.createElement('td');
        resultCell.innerText = results[i].toFixed(1);
        row.appendChild(resultCell);
        table.appendChild(row);
    }

    stepDiv.appendChild(table);
    stepsDiv.appendChild(stepDiv);
}