document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const headerLeft = document.querySelector('.header-left');
    const sidebar = document.querySelector('.sidebar');
    const modalElement = document.getElementById('createTaskModal');
    const body = document.body;
    
    // Configuration
    const scrollThreshold = 100;
    let lastScrollTop = 0;
    let scrollPosition = 0; 
    function lockScroll() {
        // Save current scroll position
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Lock body scroll
        body.style.top = `-${scrollPosition}px`;
        body.classList.add('sidebar-open');
    }
    
    function unlockScroll() {
        // Unlock body scroll
        body.classList.remove('sidebar-open');
        body.style.top = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
    }
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Open sidebar
            sidebar.classList.add('show');
            
            // Lock scroll
            lockScroll();
            
            // Hide hamburger with smooth animation
            this.classList.add('hidden');
        });
    } else {
        console.error('Sidebar toggle or sidebar element not found!');
    }

    body.addEventListener('click', function(e) {
        if (body.classList.contains('sidebar-open') && 
            sidebar && sidebarToggle &&
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            
            // Close sidebar
            sidebar.classList.remove('show');
            
            // Unlock scroll
            unlockScroll();
            
            // Show hamburger again
            sidebarToggle.classList.remove('hidden');
        }
    });
    
    function handleScroll() {
        if (window.innerWidth <= 991 && sidebarToggle && headerLeft) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (!body.classList.contains('sidebar-open')) {
                if (scrollTop > scrollThreshold) {
                    sidebarToggle.classList.add('floating');
                    headerLeft.classList.add('has-floating-menu');
                } else {
                    sidebarToggle.classList.remove('floating');
                    headerLeft.classList.remove('has-floating-menu');
                }
            }
            
            lastScrollTop = scrollTop;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    function handleResize() {
        if (window.innerWidth > 991 && sidebarToggle && headerLeft) {
            sidebarToggle.classList.remove('floating', 'hidden');
            headerLeft.classList.remove('has-floating-menu');
            
            if (body.classList.contains('sidebar-open')) {
                sidebar.classList.remove('show');
                unlockScroll();
            }
        }
    }
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 100);
    });
    
    handleResize();
    
    if (modalElement) {
        modalElement.addEventListener('show.bs.modal', function () {
            if (sidebarToggle && window.innerWidth <= 991) {
                sidebarToggle.classList.add('hidden');
            }
        });
        
        modalElement.addEventListener('hidden.bs.modal', function () {
            if (sidebarToggle && window.innerWidth <= 991) {
                sidebarToggle.classList.remove('hidden');
            }
        });
    }    

    const taskForm = document.getElementById('taskForm');
    const createTaskBtn = document.getElementById('createTaskBtn'); 

    if (taskForm && modalElement && createTaskBtn) {
        taskForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 

            if (!taskForm.checkValidity()) {
                taskForm.reportValidity();
                return;
            }
            
            // Get form values
            const taskTitle = document.getElementById('taskTitle')?.value;
            const taskPriority = document.getElementById('taskPriority')?.value;
            const taskDescription = document.getElementById('taskDescription')?.value;
            
            const originalButtonText = createTaskBtn.innerHTML;
            createTaskBtn.disabled = true;
            createTaskBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating...';
            
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            
            showSuccessToast(`Task "${taskTitle}" created successfully!`);
            
            // Reset button state
            createTaskBtn.disabled = false;
            createTaskBtn.innerHTML = originalButtonText;
            
            // Clear form after closing animation
            setTimeout(() => taskForm.reset(), 300);
        });
    }

    function showSuccessToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        document.body.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
