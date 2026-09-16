wdocument.addEventListener("DOMContentLoaded", () => {
    const cajitasPro = document.querySelectorAll('[class^="cajita-GENERAL-"]');
    let vocesDisponibles = [];

    
    function cargarVoces() {
        if ('speechSynthesis' in window) {
            vocesDisponibles = window.speechSynthesis.getVoices();
        }
    }

    if ('speechSynthesis' in window) {
        cargarVoces();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = cargarVoces;
        }
    }

    function elegirVozHumana() {
        if (!('speechSynthesis' in window)) return null;
        if (vocesDisponibles.length === 0) {
            vocesDisponibles = window.speechSynthesis.getVoices();
        }
        const voces = vocesDisponibles;
        
        
        let v = voces.find(item => item.lang && item.lang.toLowerCase().startsWith('es') && (
            item.name.includes('Natural') || 
            item.name.includes('Lucia') || 
            item.name.includes('Mia') || 
            item.name.includes('Google') || 
            item.name.includes('Monica') ||
            item.name.includes('Siri') ||
            item.name.includes('Helena') ||
            item.name.includes('Spanish')
        ));
        if (!v) {
            v = voces.find(item => item.lang && (item.lang.startsWith('es-CL') || item.lang.startsWith('es-MX') || item.lang.startsWith('es-ES') || item.lang.startsWith('es-US')));
        }
        if (!v) {
            v = voces.find(item => item.lang && item.lang.toLowerCase().startsWith('es'));
        }
        return v || (voces.length > 0 ? voces[0] : null);
    }

    cajitasPro.forEach(caja => {
        caja.style.cursor = "pointer";

        caja.addEventListener("click", () => {
            if (!('speechSynthesis' in window)) {
                alert("Ups, tu navegador no soporta voz.");
                return;
            }

            
            window.speechSynthesis.cancel();

            cajitasPro.forEach(c => {
                c.classList.remove("caja-activa-feria");
                const tit = c.querySelector("h3");
                if (tit) tit.style.color = "";
                c.querySelectorAll("li").forEach(li => {
                    li.style.color = "#cbd5e1";
                    li.style.fontWeight = "normal";
                    li.classList.remove("parrafo-leyendo");
                    const icon = li.querySelector(".icono-guia-pro");
                    if (icon) icon.remove();
                });
                const robotPrevio = c.querySelector(".robot-interno-caja");
                if (robotPrevio) robotPrevio.remove();
            });

            const tituloEl = caja.querySelector("h3");
            const itemsEl = caja.querySelectorAll("li");
            const cajaInterna = caja.querySelector(".caja1");

            const textoTitulo = tituloEl ? tituloEl.innerText : "";
            const arrayItems = Array.from(itemsEl).map(li => li.innerText);
            
            const textoTotal = `hola estudiantes, la especialidad de programacion nos enseñara, en ${textoTitulo}, aprenderemos lo siguiente: ${arrayItems.join(". ")}. insuco te espera en programacion`;

            const miniRobotHtml = document.createElement("div");
            miniRobotHtml.className = "robot-interno-caja";
            miniRobotHtml.innerHTML = `
                <div class="mini-bot-avatar">
                    <div class="mini-cabeza">
                        <div class="mini-ojo"></div>
                        <div class="mini-ojo"></div>
                    </div>
                    <div class="mini-cuerpo"></div>
                    <div class="laser-rayo"></div>
                </div>
                <div class="info-estado-bot">
                    <span class="titulo-bot-vivo">🤖 MODO EXPOSICIÓN</span>
                    <span class="sub-bot-vivo">Leyendo "${textoTitulo}"...</span>
                </div>
            `;
            cajaInterna.prepend(miniRobotHtml);

            const utter = new SpeechSynthesisUtterance(textoTotal);
            const vozSeleccionada = elegirVozHumana();
            if (vozSeleccionada) {
                utter.voice = vozSeleccionada;
            }
            
            utter.lang = 'es-CL';
            utter.rate = 1.02;
            utter.pitch = 1.1;

            utter.onstart = () => {
                caja.classList.add("caja-activa-feria");
                if (tituloEl) tituloEl.style.color = "#34d399";
                const avatarRobot = caja.querySelector(".mini-bot-avatar");
                if (avatarRobot) avatarRobot.classList.add("hablando-dentro");
            };

            utter.onboundary = (e) => {
                if (e.name === 'word') {
                    const charIdx = e.charIndex;
                    let acumulado = textoTitulo.length + 55; 

                    itemsEl.forEach((li, idx) => {
                        const txtLi = arrayItems[idx];
                        const inicioLi = acumulado;
                        const finLi = acumulado + txtLi.length + 2;

                        if (charIdx >= inicioLi && charIdx < finLi) {
                            itemsEl.forEach(itemLimpio => {
                                itemLimpio.classList.remove("parrafo-leyendo");
                                itemLimpio.style.color = "#cbd5e1";
                                itemLimpio.style.fontWeight = "normal";
                                const viejoIcono = itemLimpio.querySelector(".icono-guia-pro");
                                if (viejoIcono) viejoIcono.remove();
                            });

                            li.classList.add("parrafo-leyendo");
                            li.style.color = "#ffffff";
                            li.style.fontWeight = "bold";

                            const iconoGuia = document.createElement("span");
                            iconoGuia.className = "icono-guia-pro";
                            iconoGuia.innerHTML = "⚡";
                            li.prepend(iconoGuia);
                        }

                        acumulado = finLi;
                    });
                }
            };

            const apagarTodo = () => {
                caja.classList.remove("caja-activa-feria");
                if (tituloEl) tituloEl.style.color = "";

                itemsEl.forEach(li => {
                    li.style.color = "#cbd5e1";
                    li.style.fontWeight = "normal";
                    li.classList.remove("parrafo-leyendo");
                    const icon = li.querySelector(".icono-guia-pro");
                    if (icon) icon.remove();
                });

                const robotAEliminar = caja.querySelector(".robot-interno-caja");
                if (robotAEliminar) robotAEliminar.remove();
            };

            utter.onend = apagarTodo;
            utter.onerror = apagarTodo;

            
            window.speechSynthesis.speak(utter);
        });
    });
});
