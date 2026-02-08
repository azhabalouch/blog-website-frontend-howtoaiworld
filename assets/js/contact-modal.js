// Contact Modal functionality - to be called after footer is loaded
function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('open-contact-modal');
    const closeBtn = document.getElementById('close-contact-modal');
    const overlay = document.getElementById('modal-overlay');
    const form = document.getElementById('modal-contact-form');

    if (!modal || !openBtn) return;

    let lastFocusedElement = null;

    function openModal(e) {
        e.preventDefault();
        
        // Store the element that opened the modal
        lastFocusedElement = document.activeElement;
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-modal', 'true');
        document.body.style.overflow = 'hidden';
        
        // Focus the first input field after modal opens
        const firstInput = modal.querySelector('input[type="text"], input[type="email"], textarea');
        if (firstInput) {
            // Small delay to ensure modal animation completes and element is visible
            const MODAL_FOCUS_DELAY = 100;
            setTimeout(() => firstInput.focus(), MODAL_FOCUS_DELAY);
        }
        
        // Add focus trap
        setupFocusTrap();
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        document.body.style.overflow = '';
        
        // Remove focus trap
        removeFocusTrap();
        
        // Restore focus to the element that opened the modal
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }
    
    // Focus trap implementation
    let focusTrapHandler = null;
    
    function setupFocusTrap() {
        focusTrapHandler = function(e) {
            if (e.key === 'Tab' && modal.classList.contains('active')) {
                const focusableElements = modal.querySelectorAll(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
                );
                const focusableArray = Array.from(focusableElements);
                const firstFocusable = focusableArray[0];
                const lastFocusable = focusableArray[focusableArray.length - 1];
                
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        };
        
        document.addEventListener('keydown', focusTrapHandler);
    }
    
    function removeFocusTrap() {
        if (focusTrapHandler) {
            document.removeEventListener('keydown', focusTrapHandler);
            focusTrapHandler = null;
        }
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
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            
            // Read the action URL from the form
            const action = form.action;
            
            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            try {
                const response = await fetch(action, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    closeModal();
                    form.reset();
                    // Redirect to thank you page on success
                    window.location.href = '/pages/thanks/';
                } else {
                    alert("Error: " + (data.message || "Failed to send message"));
                }

            } catch (error) {
                alert("Something went wrong. Please try again.");
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}
