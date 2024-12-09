const $btnTabla = document.getElementById('btn-trabajos');
const $cantTrab = document.getElementById('cant-trab');
const $btnSubmit = document.getElementById('btn-submit');
const $selecMetod = document.querySelectorAll('.form-res [name="metodo"]')
const $lista = document.getElementById('lista-resultados');
const $footerRes = document.getElementById('footer-resultado');
const $grafica = document.getElementById("site-grafica");

let metodo = '';
let trabajos = [];

$btnTabla.addEventListener('click',(e) =>
{
    if ($cantTrab.value > 1 && $cantTrab.value <= 24){
        crearTabla();
        $lista.innerHTML ='';
        $footerRes.innerHTML ='';
        $grafica.innerHTML = '';
    }else{
        alert("Porfavor, ingrese un numero de trabajos correcto.")
        e.preventDefault;
    }
})

$btnSubmit.addEventListener('click', (e) =>
{
    saveMetod();
    if(metodo === ''){
        alert('Por favor, Ingrese un metodo para continuar');
        e.preventDefault;
    }else{
        leerDatos();
    }
});

function saveMetod(){
    $selecMetod.forEach( selec =>{
        if (selec.checked) {
            metodo = selec.value;
        }
    })
}

function crearTabla(){
    const $tablaTrabajos = document.getElementById('tabla-trabajos')
    let tabla = '';
    
    for (let i = 0; i < $cantTrab.value; i++) {
        tabla += `
        <tr id="job${i+1}">
            <td>J${i+1}</td>
            <td><input type="number" name="hora-inicial"></td>
            <td><input type="number" name="hora-final"></td>
            <td><input type="number" name="ganancia"></td>
        </tr>
        `
    }
    $tablaTrabajos.innerHTML = tabla;
}

function leerDatos() {
    trabajos = [];  // Reinicia si se introduce una nueva tabla

    for (let i = 0; i < $cantTrab.value; i++) {
        const hInicialInput = document.querySelector(`#job${i+1} [name="hora-inicial"]`).value;
        const hFinalInput = document.querySelector(`#job${i+1} [name="hora-final"]`).value;
        const gananciaInput = document.querySelector(`#job${i+1} [name="ganancia"]`).value;

        const hInicial = parseInt(hInicialInput);
        const hFinal = parseInt(hFinalInput);

        if (isNaN(hInicial) || isNaN(hFinal) || isNaN(gananciaInput)) {
            alert(`Por favor, ingrese valores válidos en las horas o ganancia para el trabajo ${i+1}.`);
            return;
        } 

        if (hInicial < 0 || hFinal < 0 || gananciaInput < 0) {
            alert(`Los valores no pueden ser negativos para el trabajo ${i+1}.`);
            return;
        }

        if (hFinal <= hInicial) {
            alert(`La hora final del trabajo ${i+1} no puede ser menor o igual a la hora inicial.`);
            return;
        }
        const trabajo = {
            id: `j${i+1}`,
            hInicial: hInicial,
            hFinal: hFinal,
            ganancia: parseFloat(gananciaInput),
        };
        trabajo.duracion = hFinal - hInicial;
        trabajos.push(trabajo);
    }

    trabajos.sort((a, b) => a.hInicial - b.hInicial); // Ordena por hora inicial
    console.log('Datos validados y ordenados: ', trabajos);
    resolver(trabajos);
}

function resolver(trabajos) {

    const trabajosAcp = [];
    let j = parseInt(trabajos[0].hInicial); // variable de control de horas finales
    let i = 0;

    while (i < trabajos.length) {    // Cuando las horas finales sean iguales al total, parara
        
        const trabajo = trabajos[i];
        const inicio = parseInt(trabajo.hInicial);
        
        if (inicio >= j)
        {
            const trabajoAgg = OrdenarPorMetodo(trabajos, inicio)
            trabajosAcp.push(trabajoAgg);
            j = trabajoAgg.hFinal;
        }
    i++;
    }
    imprimirRes(trabajosAcp);
}

function OrdenarPorMetodo(trabajos, inicio) {
    const valoresSimil = [];

    trabajos.forEach((element) =>
    {
        if(parseInt(element.hInicial) === inicio){
            valoresSimil.push(element);
        }
    })

    if (metodo === 'ganancia')
    {
        valoresSimil.sort((a,b) => b.ganancia - a.ganancia);    // Orden Descendente
        console.log('Ganancia--Valores similares: ', valoresSimil);
    }else if (metodo === 'cantidad')
    {
        valoresSimil.sort((a,b) => a.duracion - b.duracion);    // Orden Ascendente
        console.log('Duracion--Valores similares: ', valoresSimil);
    }
    return valoresSimil[0];
}

function imprimirRes(arrayRes){
    let sumaGanancia = 0;

    $lista.innerHTML = crearLista(arrayRes);

    arrayRes.forEach((element) =>{
        sumaGanancia += parseFloat(element.ganancia);
    })

    $footerRes.innerHTML = 
        `<h4 class= "espacio">Suma total de Ganancias: ${sumaGanancia.toFixed(2)}</h4>`;

    imprimirGrafica(arrayRes);
}

function crearLista(arrayRes) {
    let contenido ='<h3>Trabajos a Realizar:</h3>'

    for (let i = 0; i < arrayRes.length; i++) {
        contenido +=`
        <li>
        <h3>${arrayRes[i].id}</h3>
        <ul>
            <li>Hora Inicial: ${arrayRes[i].hFinal}</li>
            <li>Hora Final: ${arrayRes[i].hFinal}</li>
            <li>Ganancia: ${arrayRes[i].ganancia}</li>
            <li>Duracion: ${arrayRes[i].duracion}</li>
        </ul>
        </li>
        `
    }
    return contenido;
}

function imprimirGrafica(arrayRes) {
    
    let tabla = '';

    //Encabezado
    tabla += '<tr><td class = "text-der">Trabajos\\Horas</td>';
    const maxHora = Math.max(...trabajos.map(t => t.hFinal)); // Calcular la hora máxima para el rango de tiempo

    for (let hora = 0; hora <= maxHora; hora++) {
    tabla += `<td>${hora}</td>`;
    }
    tabla += '</tr>';   //Fin encabezado

    // Crear las filas de trabajos
    for (let i = 0; i < trabajos.length; i++) { //Calcula La altura de la tabla
        
        tabla += '<tr>';    //inicio fila
        tabla += `<td class = "text-der">${trabajos[i].id}</td>`;

        for (let hora = 0; hora < maxHora; hora++) {
            if (hora >= trabajos[i].hInicial && hora < trabajos[i].hFinal) {
                tabla += `<td class="filled"></td>`;
            } else {
                tabla += `<td></td>`;
            }
        }
        tabla += '</tr>';   //fin fila
    }

    tabla += '<tr><td class="text-der">Trabajos Aceptados</td>';
    for (let hora = 0; hora <= maxHora; hora++) {
        let idEnEstaHora = '';
        arrayRes.forEach(t => {
            if (hora >= t.hInicial && hora < t.hFinal) {
                idEnEstaHora = t.id; // Asignar el ID correspondiente si la hora está en el rango de un trabajo
            }
        });
        
        if (idEnEstaHora) {
            tabla += `<td class="trab-seleccion">${idEnEstaHora}</td>`;
        } else {
            tabla += `<td></td>`;
        }
    }
    tabla += '</tr>';
    $grafica.innerHTML = tabla;
}
