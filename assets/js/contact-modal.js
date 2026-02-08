// Contact Modal functionality - to be called after footer is loaded
function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('open-contact-modal');
    const closeBtn = document.getElementById('close-contact-modal');
    const overlay = document.getElementById('modal-overlay');
    const form = document.getElementById('modal-contact-form');

    if (!modal || !openBtn) return;

    function openModal(e) {
        e.preventDefault();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', openModal);
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const formData = new FormData(form);
                const action = form.action;
                const method = (form.method || 'POST').toUpperCase();

                const response = await fetch(action, {
                    method: method,
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Form submission failed with status ' + response.status);
                }

                // On successful submission, show feedback, close modal, reset form, and redirect
                alert('Thank you for your message! We\'ll get back to you soon.');
                closeModal();
                form.reset();
                window.location.href = '/pages/thanks/';
            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('Sorry, there was a problem sending your message. Please try again.');
            }
        });
    }
}
