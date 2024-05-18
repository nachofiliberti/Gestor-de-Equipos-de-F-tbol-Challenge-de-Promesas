// Función para obtener los jugadores del localStorage
const obtenerJugadoresLocalStorage = () => {
    const jugadoresString = localStorage.getItem('jugadores');
    return jugadoresString ? JSON.parse(jugadoresString) : [];
};

// Función para guardar los jugadores en el localStorage
const guardarJugadoresLocalStorage = (jugadores) => {
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
};

// Función para crear la tarjeta de un jugador
const crearTarjetaJugador = (jugador) => {
    const col = document.createElement('div');
    col.classList.add('col');
    col.innerHTML = `            
        <div class="card shadow-sm">
            <img src="resource/jugador.webp" class="card-img-top" alt="...">
            <div class="card-body">
                <h4 class="card-title">Nombre: ${jugador.nombre}</h4>
                <h5 class="card-text">Edad: ${jugador.edad}</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Posición: ${jugador.posicion}</li>
                <li class="list-group-item">Estado Actual: ${jugador.estadoActual}</li>
            </ul>
            <div class="card-body">
                <button onclick="main('asignarPosicion')" class="btn btn-warning">Asignar Posición</button>
            </div>
        </div>`;
    return col;
};

// Validaciones
const esNombreValido = (nombre) => /^[a-zA-Z\s]+$/.test(nombre);
const esEdadValida = (edad) => Number.isInteger(edad) && edad >= 10 && edad <= 60;
const esPosicionValida = (posicion) => ["Portero", "Defensa", "Mediocampista", "Delantero"].includes(posicion);
const esEstadoValido = (estado) => ["lesionado", "titular", "suplente"].includes(estado);

// Función para agregar un nuevo jugador al equipo
const agregarJugador = async () => {
    try {
        const nombre = prompt("Ingrese el nombre del jugador:");
        if (!nombre || !esNombreValido(nombre)) {
            alert("Nombre inválido. Solo se permiten letras y espacios.");
            return;
        }

        const edad = parseInt(prompt("Ingrese la edad del jugador:"));
        if (isNaN(edad) || !esEdadValida(edad)) {
            alert("Edad inválida. Debe ser un número entre 10 y 60.");
            return;
        }

        const posicion = prompt("Ingrese la posición del jugador:");
        if (!posicion || !esPosicionValida(posicion)) {
            alert("Posición inválida. Las posiciones válidas son: Portero, Defensa, Mediocampista, Delantero.");
            return;
        }

        const estadoActual = prompt("Ingrese el estado del jugador: lesionado/titular/suplente");
        if (!estadoActual || !esEstadoValido(estadoActual)) {
            alert("Estado inválido. Los estados válidos son: lesionado, titular, suplente.");
            return;
        }

        let jugadores = obtenerJugadoresLocalStorage();

        if (jugadores.find(jugador => jugador.nombre === nombre)) {
            alert('El jugador ya está en el equipo.');
            return;
        }

        const nuevoJugador = { nombre, edad, posicion, estadoActual };
        jugadores.push(nuevoJugador);
        guardarJugadoresLocalStorage(jugadores);

        alert('Jugador agregado correctamente.');

        const row = document.querySelector('.row');
        const col = crearTarjetaJugador(nuevoJugador);
        row.appendChild(col);

    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Función para asignar una nueva posición a un jugador
const asignarPosicion = async () => {
    try {
        const nombreJugador = prompt("Ingrese el nombre del jugador");
        if (!nombreJugador || !esNombreValido(nombreJugador)) {
            alert("Nombre inválido. Solo se permiten letras y espacios.");
            return;
        }

        const nuevaPosicion = prompt("Ingrese la nueva posición del jugador");
        if (!nuevaPosicion || !esPosicionValida(nuevaPosicion)) {
            alert("Posición inválida. Las posiciones válidas son: Portero, Defensa, Mediocampista, Delantero.");
            return;
        }

        let jugadores = obtenerJugadoresLocalStorage();

        const jugador = jugadores.find(jugador => jugador.nombre === nombreJugador);
        if (!jugador) {
            alert('Jugador no encontrado.');
            return;
        }

        jugador.posicion = nuevaPosicion;
        guardarJugadoresLocalStorage(jugadores);

        alert('Posición asignada correctamente.');

        const tarjetasJugadores = document.querySelectorAll('.card');
        tarjetasJugadores.forEach(tarjeta => {
            const nombreTarjeta = tarjeta.querySelector('.card-title').textContent.split(': ')[1];
            if (nombreTarjeta === nombreJugador) {
                tarjeta.querySelector('.list-group-item:nth-child(1)').textContent = `Posición: ${nuevaPosicion}`;
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Función para realizar un cambio durante un partido
const realizarCambio = async () => {
    try {
        const jugadorEntrante = prompt("Ingrese el nombre del jugador que entra a la cancha:");
        if (!jugadorEntrante || !esNombreValido(jugadorEntrante)) {
            alert("Nombre del jugador entrante inválido. Solo se permiten letras y espacios.");
            return;
        }

        const jugadorSaliente = prompt("Ingrese el nombre del jugador que se retira de la cancha:");
        if (!jugadorSaliente || !esNombreValido(jugadorSaliente) || jugadorEntrante === jugadorSaliente) {
            alert("Nombre del jugador saliente inválido o es el mismo que el entrante.");
            return;
        }

        let jugadores = obtenerJugadoresLocalStorage();

        const jugadorQueEntra = jugadores.find(jugador => jugador.nombre === jugadorEntrante);
        const jugadorQueSale = jugadores.find(jugador => jugador.nombre === jugadorSaliente);

        if (!jugadorQueEntra || !jugadorQueSale) {
            alert('Jugador no encontrado.');
            return;
        }

        const motivo = prompt('Por qué motivo sale el jugador: suplente/lesionado');
        if (!motivo || !esEstadoValido(motivo)) {
            alert("Motivo de salida inválido. Los motivos válidos son: suplente, lesionado.");
            return;
        }

        jugadorQueSale.estadoActual = motivo;
        jugadorQueEntra.estadoActual = "titular";
        guardarJugadoresLocalStorage(jugadores);

        alert('Cambio realizado correctamente.');

        const tarjetasJugadores = document.querySelectorAll('.card');
        tarjetasJugadores.forEach(tarjeta => {
            const nombreTarjeta = tarjeta.querySelector('.card-title').textContent.split(': ')[1];
            if (nombreTarjeta === jugadorSaliente || nombreTarjeta === jugadorEntrante) {
                tarjeta.querySelector('.list-group-item:nth-child(2)').textContent = `Estado Actual: ${nombreTarjeta === jugadorEntrante ? 'titular' : motivo}`;
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Función para listar todos los jugadores
const listarJugadores = async () => {
    const jugadores = obtenerJugadoresLocalStorage();
    const row = document.querySelector('.row');
    row.innerHTML = '';

    jugadores.forEach(jugador => {
        const col = crearTarjetaJugador(jugador);
        row.appendChild(col);
    });
};

// Función principal para manejar las acciones del usuario
const main = async (action) => {
    try {
        if (action === "agregarJugador") {
            await agregarJugador();
        } else if (action === "listarJugadores") {
            await listarJugadores();
        } else if (action === "asignarPosicion") {
            await asignarPosicion();
        } else if (action === "realizarCambio") {
            await realizarCambio();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// llamar funcion principal para inicializar app
main()
