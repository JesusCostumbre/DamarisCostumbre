document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    const resultadosSection = document.getElementById('resultados-analisis');
    const calculadoraSection = document.getElementById('calculadora');
    const heroSection = document.getElementById('hero');
    const asesoraSection = document.getElementById('asesora-seccion') || document.querySelector('.asesora-presentacion'); 
    const btnRegresarInicio = document.getElementById('btn-regresar-inicio');
    const btnSubmit = document.getElementById('btn-submit'); 

    const scoreValues = {
        q1_registro: { 'siempre': 3, 'a_veces': 1, 'no_nunca': 0 },
        q2_ahorro_porcentaje: { 'mas_20': 3, 'entre_10_20': 2, 'menos_10': 1, 'no_ahorro': 0 },
        q3_fondo_emergencia: { 'si': 3, 'en_proceso': 2, 'no': 0 }, 
        q4_seguros: { 'ambos': 3, 'solo_uno': 2, 'ninguno': 0 }, 
        q5_respaldo_familiar: { 'si': 3, 'no_seguro': 1, 'no': 0 }, 
        q6_plan_retiro: { 'si': 3, 'me_interesa': 1, 'no': 0 },
        q7_necesidad_retiro: { 'si': 3, 'no_calculado': 0 },
        q8_deducciones: { 'si': 3, 'no': 0, 'no_se': 1 }, 
        q9_relacion_dinero: { 'en_control': 3, 'tranquilidad': 2, 'manejar_mejor': 1, 'estres': 0 },
        q10_cien_mil: { 'invertir': 3, 'ahorrar_e_invertir': 2, 'pagar_deudas': 2, 'gastar': 0, 'no_saber': 0 },
        q11_donde_ahorras: { 'inversiones': 3, 'cuenta_tradicional': 1, 'casa_efectivo': 0, 'no_tengo_ahorros': 0 } 
    };
    
    const maxScore = 33; 
    const RANGO_EXCELENTE = 25; 
    const RANGO_BUENO = 15;     

    function calculateAndDisplayResults() {
        let totalScore = 0;
        let results = {};

        for (const name in scoreValues) {
            const selectedInput = quizForm.querySelector(`input[name="${name}"]:checked`);
            if (selectedInput) {
                const selectedValue = selectedInput.value;
                totalScore += scoreValues[name][selectedValue] || 0; 
                results[name] = selectedValue;
            }
        }

        const porcentaje = Math.round((totalScore / maxScore) * 100);

        let generalDiagnosis = '';
        let diagnosisMessage = '';
        let estadoGeneral = 'estado-neutro';

        if (totalScore >= RANGO_EXCELENTE) {
            generalDiagnosis = 'Salud Financiera Excelente';
            diagnosisMessage = 'Tienes una sólida disciplina financiera. Has cubierto tus bases de protección y estás bien encaminado hacia el retiro. Te ayudaremos a optimizar aún más tus estrategias.';
            estadoGeneral = 'estado-satisfactorio';
        } else if (totalScore >= RANGO_BUENO) {
            generalDiagnosis = 'Salud Financiera Buena';
            diagnosisMessage = 'Tienes hábitos saludables, pero hemos identificado áreas de oportunidad clave, especialmente en protección o planificación a largo plazo, para asegurar tu tranquilidad.';
            estadoGeneral = 'estado-neutro';
        } else {
            generalDiagnosis = 'Salud Financiera en Riesgo';
            diagnosisMessage = 'Tu situación requiere atención inmediata en hábitos, protección y planificación. No te preocupes, el primer paso es tomar acción y estamos aquí para ayudarte.';
            estadoGeneral = 'estado-alerta';
        }

        let claseColorProgreso;
        if (totalScore >= RANGO_EXCELENTE) {
            claseColorProgreso = 'progreso-satisfactorio';
        } else if (totalScore >= RANGO_BUENO) {
            claseColorProgreso = 'progreso-neutro';
        } else {
            claseColorProgreso = 'progreso-alerta';
        }

        const graficoElement = document.getElementById('grafico-progreso');
        const porcentajeElement = document.getElementById('porcentaje-display');

        graficoElement.className = 'grafico ' + claseColorProgreso;

        const colorEstado = estadoGeneral.split('-')[1]; 
        const colorDiagnosticoProp = getComputedStyle(document.body).getPropertyValue(`--color-${colorEstado}`) || 'var(--color-primary)'; 

        graficoElement.style.background = `conic-gradient(
            ${colorDiagnosticoProp} 0deg, 
            ${colorDiagnosticoProp} ${porcentaje * 3.6}deg, 
            var(--color-border) ${porcentaje * 3.6}deg, 
            var(--color-border) 360deg
        )`;

        porcentajeElement.textContent = `${porcentaje}%`;

        const emergenciaStatus = {
            'si': { strong: 'Cubierto', span: 'Satisfactorio', class: 'estado-satisfactorio' },
            'en_proceso': { strong: 'En Proceso', span: 'Atención Requerida', class: 'estado-neutro' }, 
            'no': { strong: 'No Cubierto', span: 'Riesgo Alto', class: 'estado-alerta' }
        }[results.q3_fondo_emergencia] || { strong: 'Sin Datos', span: 'Evaluada', class: 'estado-neutro' };

        const proteccionStatus = {
            'ambos': { strong: 'Completa', span: 'Satisfactorio', class: 'estado-satisfactorio' },
            'solo_uno': { strong: 'Parcial', span: 'Atención Requerida', class: 'estado-neutro' },
            'ninguno': { strong: 'Ausente', span: 'Riesgo Alto', class: 'estado-alerta' }
        }[results.q4_seguros] || { strong: 'Sin Datos', span: 'Evaluada', class: 'estado-neutro' };


        const nombreInput = quizForm.querySelector('input[name="Nombre_Usuario"]').value || 'Estimado Cliente';
        document.getElementById('titulo-resultados').textContent = `¡Aquí están tus resultados, ${nombreInput}!`;
        document.getElementById('diagnostico-titulo').textContent = generalDiagnosis;
        document.getElementById('diagnostico-mensaje').textContent = diagnosisMessage;
        document.getElementById('metrica-puntuacion').textContent = `${totalScore}/${maxScore}`;
        
        let estadoPuntuacionSpan = 'Evaluación';
        if (totalScore >= RANGO_EXCELENTE) estadoPuntuacionSpan = 'Excelente Evaluación';
        else if (totalScore >= RANGO_BUENO) estadoPuntuacionSpan = 'Buena Evaluación';
        else estadoPuntuacionSpan = 'Baja Evaluación';
        
        document.getElementById('estado-puntuacion').textContent = estadoPuntuacionSpan;
        document.getElementById('estado-puntuacion').className = estadoGeneral;
        document.getElementById('metrica-emergencia').textContent = emergenciaStatus.strong;
        document.getElementById('estado-emergencia').textContent = emergenciaStatus.span;
        document.getElementById('estado-emergencia').className = emergenciaStatus.class;
        document.getElementById('metrica-proteccion').textContent = proteccionStatus.strong;
        document.getElementById('estado-proteccion').textContent = proteccionStatus.span;
        document.getElementById('estado-proteccion').className = proteccionStatus.class;
        
        const recProteccionDetalle = document.getElementById('rec-proteccion-detalle');
        if (recProteccionDetalle) {
             if (proteccionStatus.strong === 'Ausente' || proteccionStatus.strong === 'Parcial') {
                 recProteccionDetalle.textContent = 'Dado que tu cobertura es ' + proteccionStatus.strong.toLowerCase() + ', te recomendamos explorar opciones flexibles de seguros de vida o de gastos médicos mayores para proteger el patrimonio y los ingresos de tu familia ante un evento inesperado.';
             } else {
                 recProteccionDetalle.textContent = 'Tu cobertura de protección es sólida. Sigue revisando tus pólizas anualmente para asegurar que cubran tus necesidades actuales.';
             }
        }
        
        const recRetiroDetalle = document.getElementById('rec-retiro-detalle');
        if (recRetiroDetalle) {
             if (results.q6_plan_retiro !== 'si' || results.q7_necesidad_retiro !== 'si') {
                 recRetiroDetalle.textContent = 'Es fundamental formalizar un plan de retiro. Te ayudaremos a canalizar tu ahorro a instrumentos que ofrecen ventajas fiscales y crecimiento compuesto para que alcances la meta que necesitas.';
             } else {
                 recRetiroDetalle.textContent = 'Excelente planeación para el retiro. Te ayudaremos a revisar si estás optimizando al máximo las deducciones fiscales disponibles.';
             }
        }

        // =========================================================
        // LLENAR LAS CAJAS OCULTAS PARA EMAILJS
        // =========================================================
        const setFormValue = (name, value) => {
            const input = quizForm.querySelector(`input[name="${name}"]`);
            if (input) input.value = value;
        };

        setFormValue('Resultado_Analisis_Final', generalDiagnosis);
        setFormValue('Porcentaje', `${porcentaje}%`);
        setFormValue('Diagnostico_Mensaje', diagnosisMessage);
        setFormValue('Puntuacion', `${totalScore}/${maxScore}`);
        setFormValue('Estado_Puntuacion', estadoPuntuacionSpan);
        setFormValue('Fondo_Emergencia', emergenciaStatus.strong);
        setFormValue('Estado_Emergencia', emergenciaStatus.span);
        setFormValue('Cobertura_Proteccion', proteccionStatus.strong);
        setFormValue('Estado_Proteccion', proteccionStatus.span);
        
        if(recProteccionDetalle) setFormValue('Rec_Proteccion', recProteccionDetalle.textContent);
        if(recRetiroDetalle) setFormValue('Rec_Retiro', recRetiroDetalle.textContent);

        resultadosSection.classList.remove('hidden');
    }

    function resetForm() {
        quizForm.reset();
    }

    // =======================================================================
    // FUNCIÓN DE ENVÍO CON EMAILJS
    // =======================================================================
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const originalBtnText = btnSubmit.textContent;
        btnSubmit.textContent = 'Calculando y enviando...';
        btnSubmit.disabled = true;
        
        calculadoraSection.classList.add('hidden');
        if (asesoraSection) asesoraSection.classList.add('hidden');
        if (heroSection) heroSection.classList.add('hidden');
        
        calculateAndDisplayResults(); 
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        emailjs.sendForm('service_c6vt4ce', 'template_9wz4mh3', quizForm)
        .then(() => {
            console.log("¡Éxito! Correo enviado al cliente y a Damaris.");
            btnSubmit.textContent = originalBtnText; 
            btnSubmit.disabled = false;
        }, (error) => {
            console.error("Error al enviar el correo:", error.text);
            btnSubmit.textContent = originalBtnText;
            btnSubmit.disabled = false;
        });
    });

    // Lógica para los botones de Asesoría (WhatsApp)
    const asesoriaButtons = document.querySelectorAll('.btn-asesoria');
    asesoriaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            let userName = quizForm.querySelector('input[name="Nombre_Usuario"]').value;
            let baseMessage = "Hola Damaris, acabo de completar el Check Up Financiero y me gustaría agendar una Asesoría Gratuita para revisar mis resultados.";
            if (userName) baseMessage += ` Mi nombre es ${userName}.`;
            const encodedMessage = encodeURIComponent(baseMessage);
            const whatsappNumber = '5219512513470';
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        });
    });

    // Lógica para el botón de Regresar al Inicio
    if (btnRegresarInicio) {
        btnRegresarInicio.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm();
            resultadosSection.classList.add('hidden');
            if (heroSection) heroSection.classList.remove('hidden');
            calculadoraSection.classList.remove('hidden');
            if (asesoraSection) asesoraSection.classList.remove('hidden'); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});