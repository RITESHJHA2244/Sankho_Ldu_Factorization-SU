// Function to dynamically generate the matrix input form
function generateMatrixInput() {
    const matrixSize = document.getElementById("matrix-size").value;
    const matrixForm = document.getElementById("matrix-form");
    matrixForm.innerHTML = ""; // Clear existing form

    // Generate matrix input fields
    for (let i = 0; i < matrixSize; i++) {
        const row = document.createElement("div");
        row.classList.add("matrix-row");

        for (let j = 0; j < matrixSize; j++) {
            const input = document.createElement("input");
            input.type = "number";
            input.id = `matrix-${i}-${j}`;
            input.placeholder = `a${i + 1}${j + 1}`;
            row.appendChild(input);
        }

        matrixForm.appendChild(row);
    }
}

// Function to get the matrix values from the input
function getMatrix() {
    const matrixSize = document.getElementById("matrix-size").value;
    const matrix = [];
    
    for (let i = 0; i < matrixSize; i++) {
        const row = [];
        for (let j = 0; j < matrixSize; j++) {
            const value = parseFloat(document.getElementById(`matrix-${i}-${j}`).value);
            row.push(value);
        }
        matrix.push(row);
    }
    
    return matrix;
}

// Function to perform LU decomposition and track elimination steps
function luDecompose(matrix) {
    const n = matrix.length;
    const L = Array.from({ length: n }, () => Array(n).fill(0));
    const U = Array.from({ length: n }, () => Array(n).fill(0));
    const D = Array.from({ length: n }, () => Array(n).fill(0));
    const steps = []; // Array to track elimination steps

    for (let i = 0; i < n; i++) {
        L[i][i] = 1; // Diagonal elements of L are 1

        // Calculate U elements
        for (let j = i; j < n; j++) {
            U[i][j] = matrix[i][j];
            for (let k = 0; k < i; k++) {
                U[i][j] -= L[i][k] * U[k][j];
            }
        }

        // Log intermediate U after each row calculation
        steps.push({
            type: "U",
            description: `After computing U for row ${i + 1}`,
            matrix: JSON.parse(JSON.stringify(U)),
        });

        // Calculate L elements
        for (let j = i + 1; j < n; j++) {
            L[j][i] = matrix[j][i];
            for (let k = 0; k < i; k++) {
                L[j][i] -= L[j][k] * U[k][i];
            }
            L[j][i] /= U[i][i];
        }

        // Log intermediate L after each row calculation
        steps.push({
            type: "L",
            description: `After computing L for column ${i + 1}`,
            matrix: JSON.parse(JSON.stringify(L)),
        });
    }

    // Extract D and normalize U
    for (let i = 0; i < n; i++) {
        D[i][i] = U[i][i];
        U[i][i] = 1; // Normalize U diagonal
    }

    // Log final L, D, and U
    steps.push({
        type: "LDU",
        description: "Final L, D, and U matrices",
        L: JSON.parse(JSON.stringify(L)),
        D: JSON.parse(JSON.stringify(D)),
        U: JSON.parse(JSON.stringify(U)),
    });

    return { L, D, U, steps };
}

// Function to display the steps of the factorization
function displaySteps(L, D, U, steps) {
    const stepsContainer = document.getElementById("steps");
    stepsContainer.innerHTML = "";

    let stepHtml = "<h3>Step-by-Step LDU Factorization:</h3>";

    // Display each intermediate step
    steps.forEach((step, index) => {
        stepHtml += `<p><strong>Step ${index + 1}: ${step.description}</strong></p>`;
        stepHtml += `<pre>${matrixToString(step.matrix || step.L || step.U)}</pre>`;
    });

    // Display final L, D, and U matrices
    stepHtml += "<h3>Final Matrices:</h3>";
    stepHtml += "<p><strong>L (Lower Triangular Matrix):</strong></p><pre>" + matrixToString(L) + "</pre>";
    stepHtml += "<p><strong>D (Diagonal Matrix):</strong></p><pre>" + matrixToString(D) + "</pre>";
    stepHtml += "<p><strong>U (Upper Triangular Matrix):</strong></p><pre>" + matrixToString(U) + "</pre>";

    stepsContainer.innerHTML = stepHtml;
}

// Helper function to convert a matrix to a string for display
function matrixToString(matrix) {
    return matrix.map(row => row.join("\t")).join("\n");
}

// Function to calculate and display LDU decomposition
function calculateLDU() {
    const matrix = getMatrix();
    const { L, D, U, steps } = luDecompose(matrix);
    displaySteps(L, D, U, steps);
}
