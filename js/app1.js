let dataObject = {};
let cantObject = 4; //Por defecto

const $pesoMax = document.getElementById('peso-max');
const $btnSubmit = document.querySelector('#btnSubmit');
const $selecMetod = document.querySelectorAll('.form-res [name="metodo"]')

let pesoMax = 0;
let metodo = '';

$btnSubmit.addEventListener('click', (e) => {
    if (validar()) {
        resolver(metodo);
    } else {
        e.preventDefault();
    }
});

function selectOject(){
    for (let i = 0; i < cantObject; i++) {
        const objeto = {
            descripcion : document.querySelector(`#obj${i+1} .descrip`).value,
            valor : document.querySelector(`#obj${i+1} .valor`).value,
            peso : document.querySelector(`#obj${i+1} .peso`).value,
            indice : document.querySelector(`#obj${i+1} .valor`).value / document.querySelector(`#obj${i+1} .peso`).value
        }
        dataObject[`objeto${i+1}`] = objeto;
    }
}

function saveMetod(){
    $selecMetod.forEach( selec =>{
        if (selec.checked) {
            metodo = selec.value;
        }
    })
}

function ordenarObjts(sortMetod) {
    let ordenamiento = Object.entries(dataObject);

    if (sortMetod === 'peso') {
        ordenamiento.sort(([, A], [, B]) => A[sortMetod] - B[sortMetod]);
    }else{
        ordenamiento.sort(([, A], [, B]) => B[sortMetod] - A[sortMetod]);
    }

    // console.log(ordenamiento);
    //[['objeto1'],[{descripcion:'',valor:'',peso:'',indice:''}], ...]
    //Los objetos cambian de lugar luego de ordenar el array
    return ordenamiento;
}

function resolver(sortMetod) {

    const objtsOrdenados = ordenarObjts(sortMetod);
    let sumaPeso = 0;
    let i = 0;   
    let aux = 0;   
    let porcentajeParticion = 0;

    while (i < cantObject) {
        const pesoObjeto = parseInt(objtsOrdenados[i][1].peso);
        if (pesoMax - sumaPeso > pesoObjeto) {
            sumaPeso += pesoObjeto;
            i++;
        } else {
            //crando una particion del boejto
            aux = pesoMax - sumaPeso;
            porcentajeParticion = aux / pesoObjeto;
            sumaPeso += pesoObjeto * porcentajeParticion;
            break;
        }
    }
    
    if (i >= cantObject) {
        i--;
    }
    crearLista(i, objtsOrdenados, porcentajeParticion);
}

function crearLista(numObj, objtsOrdenados, porcentaje) {

    const $lista = document.getElementById('lista-resultados');
    const $footerRes = document.getElementById('footer-resultado');

    let contenido ='<h3>Objetos a llevar:</h3>';
    let sumaValor = 0;

    for (let i = 0; i <= numObj; i++)
    {
        contenido += `
        <li>
        <h3>${objtsOrdenados[i][1].descripcion}</h3>
        <div>
            Valor: ${objtsOrdenados[i][1].valor}
            Peso: ${objtsOrdenados[i][1].peso}
            Indice: ${objtsOrdenados[i][1].indice.toFixed(2)}
        </div>
        </li>
        `
        if(i === numObj && (porcentaje !=0)){
            sumaValor += parseFloat(objtsOrdenados[i][1].valor) * porcentaje;
        } else {
            sumaValor += parseFloat(objtsOrdenados[i][1].valor);
        };
    }

    if (porcentaje === 1 || porcentaje === 0){
        $lista.innerHTML = contenido;
    }else{
    $lista.innerHTML = contenido + 
    `
    <h4>
        El objeto: ${objtsOrdenados[numObj][1].descripcion}
        tuvo una particion del ${(porcentaje * 100).toFixed(2)}%, Por lo que:
    </h4>
    <li>
        Su nuevo valor es: ${(objtsOrdenados[numObj][1].valor * porcentaje).toFixed(2)}
    </li>
    <li>
        Su nuevo peso es: ${objtsOrdenados[numObj][1].peso * porcentaje}
    </li>
    <li>
        Su nuevo indice es: ${(objtsOrdenados[numObj][1].indice * porcentaje).toFixed(2)}
    </li>
    `;
    }
    $footerRes.innerHTML = `<h4 class= "espacio">Suma total de valor: ${sumaValor.toFixed(2)}</h4>`;
}

function validar() {
    // Verificamos el campo de peso máximo
    pesoMax = parseFloat($pesoMax.value);
    saveMetod();
    selectOject();

    if (isNaN(pesoMax) || pesoMax <= 0) {
        alert('Por favor, ingrese un peso máximo válido.');
        return false;
    }
    if (!metodo) {
        alert('Por favor, seleccione un método de ordenación.');
        return false;
    }
    // Verificamos los objetos
    for (let i = 0; i < cantObject; i++) {
        const descripcion = document.querySelector(`#obj${i+1} .descrip`).value;
        const valor = document.querySelector(`#obj${i+1} .valor`).value;
        const peso = document.querySelector(`#obj${i+1} .peso`).value;
        
        // Verificamos que los campos no estén vacíos
        if (!descripcion || !valor || !peso) {
            alert(`Por favor, complete todos los campos del objeto ${i+1}.`);
            return false;
        }
        // Verificamos que los valores sean números positivos
        if (isNaN(valor) || isNaN(peso) || valor <= 0 || peso <= 0) {
            alert(`Por favor, ingrese valores válidos para el objeto ${i+1}.`);
            return false;
        }
    }
    return true;
}