document.getElementById('evaluar').addEventListener('click', function() {
    const expresion = document.getElementById('expresion').value.trim(); // Obtenemos la expresión del input y eliminamos espacios extra

    // Validamos que solo haya números, operadores y paréntesis
    const expresionRegular = /^[0-9+\-*/() ]+$/;
    if (!expresionRegular.test(expresion)) {
        swal("Error", "Solo se permiten números, operadores (+, -, *, /) y paréntesis.", "error");
        return; // Si no pasa la validación, salimos de la función
    }

    // Validar que no empiece con un número negativo
    if (expresion.startsWith('-')) {
        swal("Error", "No se permite empezar con un número negativo.", "error");
        return; // Si empieza con un número negativo, salimos de la función
    }

    // Validar que no haya operadores sin números después (como "2+")
    if (/[+\-*/]$/.test(expresion)) {
        swal("Error", "Operación incompleta: falta un número después del operador.", "error");
        return; // Si la expresión termina con un operador, salimos de la función
    }

    // Validar que no haya operadores consecutivos
    if (/([+\-*/])\1/.test(expresion)) {
        swal("Error", "Operación incorrecta: no pueden haber operadores consecutivos.", "error");
        return; // Si hay operadores consecutivos, salimos de la función
    }

    // Mostrar los pasos y evaluar la expresión
    let partes = []; // Guardaremos cada parte de la evaluación
    let contadorPartes = 1; // Iniciamos el contador de partes desde 1

    // Evaluamos primero las expresiones dentro de los paréntesis
    let expresionSinParentesis = expresion.replace(/\(([^()]+)\)/g, (match, subExp) => {
        const resultado = eval(subExp); // Evaluamos lo que está dentro del paréntesis
        partes.push(`Parte ${contadorPartes++}: ${subExp} = ${resultado}`); // Guardamos la parte resuelta
        return resultado; // Reemplazamos el paréntesis con el resultado
    });

    // Dividimos la expresión sin paréntesis en operaciones (+ y -)
    const operaciones = expresionSinParentesis.split(/(?=[+-])/); // Dividimos por suma y resta
    let resultadoParcial = eval(operaciones[0]); // Evaluamos la primera parte de la expresión

    // Recorremos las demás partes de la expresión
    for (let i = 1; i < operaciones.length; i++) {
        const evaluacion = eval(operaciones[i]); // Evaluamos cada parte
        partes.push(`Parte ${contadorPartes++}: ${resultadoParcial} ${operaciones[i][0]} ${Math.abs(evaluacion)} = ${eval(`${resultadoParcial}${operaciones[i][0]}${evaluacion}`)}`);
        resultadoParcial = eval(`${resultadoParcial}${operaciones[i][0]}${evaluacion}`); // Actualizamos el resultado parcial
    }

    // Agregamos el resultado final
    partes.push(`Resultado final = ${resultadoParcial}`);

    // Mostramos el mensaje final con todas las partes resueltas
    let mensaje = `Expresión ingresada: ${expresion}\n\n`;
    partes.forEach(parte => {
        mensaje += `${parte}\n`; // Mostramos cada parte
    });

    swal("Resultado", mensaje, "success"); // Mostramos el resultado en SweetAlert
});

// Funcionalidad del botón "Limpiar"
document.getElementById('limpiar').addEventListener('click', function() {
    document.getElementById('expresion').value = ''; // Limpiar la entrada de texto
    swal("Limpieza completa", "La expresión y el resultado han sido limpiados.", "success");
});
