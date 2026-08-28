document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.querySelector(".contenedor1");
    
    if (mainContainer && !document.getElementById("robot")) {
        const robotHTML = `
            <div class="robot-container">
                <div class="robot" id="robot">
                    <div class="robot-head">
                        <div class="eye"></div>
                        <div class="eye"></div>
                    </div>
                    <div class="robot-body"></div>
                </div>
                <div id="robot-status">Asistente INSUCO: Haz clic en cualquier caja para iniciar la presentación.</div>
            </div>
        `;
        mainContainer.insertAdjacentHTML('beforeend', robotHTML);
    }

    const cajas = document.querySelectorAll('[class^="cajita-GENERAL-"]');
    const robot = document.getElementById("robot");
    const statusText = document.getElementById("robot-status");

    function obtenerVozNatural() {
        if (!('speechSynthesis' in window)) return null;
        const voces = window.speechSynthesis.getVoices();
        let vozSeleccionada = voces.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Helena') || v.name.includes('Sabina') || v.name.includes('Dalia')));
        if (!vozSeleccionada) {
            vozSeleccionada = voces.find(v => v.lang === 'es-ES' || v.lang === 'es-MX' || v.lang === 'es-US');
        }
        if (!vozSeleccionada) {
            vozSeleccionada = voces.find(v => v.lang && v.lang.toLowerCase().startsWith('es'));
        }
        return vozSeleccionada || (voces.length > 0 ? voces[0] : null);
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            obtenerVozNatural();
        };
    }

    cajas.forEach(caja => {
        caja.style.cursor = "pointer";

        caja.addEventListener("click", () => {
            if (!('speechSynthesis' in window)) {
                alert("Tu navegador no soporta lectura de voz.");
                return;
            }

            window.speechSynthesis.cancel();

            cajas.forEach(c => {
                c.classList.remove("caja-activa-feria");
                const tit = c.querySelector("h3");
                if (tit) tit.style.color = "";
                c.querySelectorAll("li").forEach(li => {
                    li.style.color = "#cbd5e1";
                    li.style.fontWeight = "normal";
                    li.classList.remove("parrafo-leyendo");
                    const icon = li.querySelector(".mini-robot-guia");
                    if (icon) icon.remove();
                });
            });

            const tituloElemento = caja.querySelector("h3");
            const itemsElementos = caja.querySelectorAll("li");

            const tituloTexto = tituloElemento ? tituloElemento.innerText : "";
            const itemsTextoArr = Array.from(itemsElementos).map(li => li.innerText);
            const textoCompleto = `insuco te enseñaremos: ${tituloTexto}. ${itemsTextoArr.join(". ")}`;

            const utterance = new SpeechSynthesisUtterance(textoCompleto);
            const voz = obtenerVozNatural();
            if (voz) {
                utterance.voice = voz;
            }
            
            utterance.lang = 'es-ES';
            utterance.rate = 0.95;
            utterance.pitch = 1.05;

            utterance.onstart = () => {
                if (robot) robot.classList.add('speaking');
                if (statusText) statusText.innerText = `Presentando: "${tituloTexto}"...`;

                caja.classList.add("caja-activa-feria");

                if (tituloElemento) {
                    tituloElemento.style.color = "#34d399"; 
                }
            };

            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    const charIndex = event.charIndex;
                    let acumulado = tituloTexto.length + 23; 

                    itemsElementos.forEach((li, index) => {
                        const textoLi = itemsTextoArr[index];
                        const inicioLi = acumulado;
                        const finLi = acumulado + textoLi.length + 2;

                        if (charIndex >= inicioLi && charIndex < finLi) {
                            itemsElementos.forEach(item => {
                                item.classList.remove("parrafo-leyendo");
                                item.style.color = "#ffffff";
                                item.style.fontWeight = "normal";
                                const viejoIcono = item.querySelector(".mini-robot-guia");
                                if (viejoIcono) viejoIcono.remove();
                            });

                            li.classList.add("parrafo-leyendo");
                            li.style.color = "#34d399";
                            li.style.fontWeight = "bold";

                            const miniRobot = document.createElement("span");
                            miniRobot.className = "mini-robot-guia";
                            miniRobot.innerHTML = "🤖";
                            li.prepend(miniRobot);
                        }

                        acumulado = finLi;
                    });
                }
            };

            const limpiarYRestaurar = () => {
                if (robot) robot.classList.remove('speaking');
                if (statusText) statusText.innerText = "Asistente INSUCO: Selecciona otra área de especialidad.";

                caja.classList.remove("caja-activa-feria");

                if (tituloElemento) {
                    tituloElemento.style.color = ""; 
                }

                itemsElementos.forEach(li => {
                    li.style.color = "#cbd5e1";
                    li.style.fontWeight = "normal";
                    li.classList.remove("parrafo-leyendo");
                    const icon = li.querySelector(".mini-robot-guia");
                    if (icon) icon.remove();
                });
            };

            utterance.onend = limpiarYRestaurar;
            utterance.onerror = limpiarYRestaurar;

            setTimeout(() => {
                window.speechSynthesis.speak(utterance);
            }, 50);
        });
    });
});