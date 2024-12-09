const $btnTabla = document.getElementById('btn-subconjuntos');
const $cantSubConjuntos = document.getElementById('cant-subconjuntos');
const $btnSubmit = document.getElementById('btn-submit');
const $lista = document.getElementById('lista-resultados');
const $footerRes = document.getElementById('footer-resultado');
const $grafica = document.getElementById('site-grafica')

let conjuntoU = [];
let subSets = [];

$btnTabla.addEventListener('click', (e) =>{
    
    if ($cantSubConjuntos.value > 1 && $cantSubConjuntos.value <= 20){
        crearTabla();
        $lista.innerHTML ='';
        $footerRes.innerHTML ='';
        $grafica.innerHTML = '';
    }else{
        alert("Porfavor, ingrese un numero de subconjuntos correcto.")
        e.preventDefault;
    }
})

$btnSubmit.addEventListener('click', leerDatos);

function crearTabla(){
    const $tablaFSubC = document.getElementById('tabla-f-subconjutos')
    let tabla = '';
    
    for (let i = 0; i < $cantSubConjuntos.value; i++) {
        tabla += `
        <tr id="sSet${i+1}">
            <td>S${i+1}</td>
            <td><input type="text" name="subset" placeholder="ej. 1,2,3,4.."></td>
        </tr>
        `
    }
    $tablaFSubC.innerHTML = tabla;
}

function leerDatos() {
    subSets = [];
    conjuntoU = []; // Reinicia las variables para que no se acumulen

    // Validar y procesar el conjunto universal
    const inputU = document.getElementById('conjunto-u').value.trim();
    if (!validarInput(inputU)) {
        alert("El conjunto U esta mal digitado, ingrese un conjunto sin numeros duplicados y separados por comas");
        return;
    }

    conjuntoU = eliminarDuplicados(inputU.split(",").map(Number)); // Elimina duplicados

    // Validar y procesar los subconjuntos
    for (let i = 0; i < $cantSubConjuntos.value; i++) {
        const subsetInput = document.querySelector(`#sSet${i+1} [name="subset"]`).value.trim();
        if (!validarInput(subsetInput)) {
            alert(`El subconjunto S${i+1} debe contener solo números separados por comas, sin duplicados.`);
            return;
        }
        const subset = eliminarDuplicados(subsetInput.split(",").map(Number)); // Elimina duplicados
        subSets.push(subset);
    }

    // console.log('U = ', conjuntoU);
    // console.log('subsets = ', subSets);

    resolverSetConversing();
}

function eliminarDuplicados(arr) {
    const resultado = [];
    for (let i = 0; i < arr.length; i++) {
        if (!resultado.includes(arr[i])) {
            resultado.push(arr[i]);
        }
    }
    return resultado;
}

function validarInput(input) {
    // Validar formato: números separados por comas
    const regex = /^(\d+)(,\d+)*$/;
    if (!regex.test(input)) {
        return false;
    }
    // Verificar duplicados
    const numbers = input.split(",").map(Number);
    return new Set(numbers).size === numbers.length;
}


function resolverSetConversing() {
    let uncovered = [...conjuntoU]; // Lista de elementos no cubiertos
    const selectedSubsets = [];

    while (uncovered.length > 0) {
        let bestSubset = null;
        let subSetMaxCover = 0;

        // Busca el subconjunto que cubra más elementos no cubiertos
        for (let i = 0; i < subSets.length; i++) {
            const subset = subSets[i];
            
            //Verifica si el conjunto uncovered contiene valores de un subconjunto:            
            const intersection = subset.filter(element => uncovered.includes(element));
            
            if (intersection.length > subSetMaxCover) {
                subSetMaxCover = intersection.length;
                bestSubset = subset;
            }
        }

        if (!bestSubset){   //Para cuando no hay subset que agregar
            break;  
        }
        selectedSubsets.push(bestSubset);
        uncovered = uncovered.filter(e => !bestSubset.includes(e)); // No incluye el Mejor subset
    }
        // console.log('Elementos no cubiertos: ', uncovered);
        // console.log('Subsets seleccionados: ', selectedSubsets);

    imprimirRes(uncovered, selectedSubsets);
    imprimirGrafica(selectedSubsets);
}

function imprimirRes(uncovered, subsetsAcepts) {
    let lista = `
    <h3 class ="espacio">Conjunto Universal(U) = {${conjuntoU}}</h3>
    <h4>Sub Conjuntos seleccionados para cubrir U: </h4>`;

    let listaFooter = '';

    subsetsAcepts.forEach(element => {
        lista += `
        <li>{${element}}</li>
        `
    });

    if (uncovered.length > 0){
        listaFooter = `
        <h4>Se logró cubrir parcialmente el conjunto universal(u)</h4>
        <ul>
            <li>Conjunto U sobrante = {${uncovered}}</li>
        </ul>
        `;
    }else{
        listaFooter = `
        <h4>Se logró cubrir totalmente el conjunto universal(u)</h4>
        `;
    }

    $lista.innerHTML = lista;
    $footerRes.innerHTML = listaFooter;
}   


function imprimirGrafica(selecteds) {
    const sortU = conjuntoU.sort((a,b) => a - b);
    const arraySelect = selecteds.flat().sort((a,b) => a - b);
    
    let tabla = `<tr>
        <td class="text-der">Conjunto Universal:</td>
    `;
    for (let i = 0; i <= sortU[sortU.length-1]; i++) {
        
        if (sortU.includes(i)){
            tabla += `<td class='filled'>${i}</td>`;
        }else{
            tabla += `<td></td>`;
        }
    }
    tabla += '</tr>';

    tabla += `<tr>
        <td class="text-der">Sub-Conjuntos:</td>
    `;
    for (let i = 0; i <= arraySelect[arraySelect.length-1]; i++) {
        if (arraySelect.includes(i)){
            tabla += `<td class='seleccion-grafica'>${i}</td>`;
        }else{
            tabla += `<td></td>`;
        }
    }
    tabla +='</tr>';

    $grafica.innerHTML = tabla;

}