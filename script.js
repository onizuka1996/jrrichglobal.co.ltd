// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-sm');
    } else {
        navbar.classList.remove('shadow-sm');
    }
});

// Form submission handler
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your form submission logic here
    alert('ขอบคุณสำหรับข้อความ เราจะติดต่อกลับโดยเร็วที่สุด');
    this.reset();
});

// Job Application Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const jobForm = document.getElementById('jobApplicationForm');
    if (jobForm) {
        jobForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create FormData object to handle file uploads
            const formData = new FormData(jobForm);
            
            // Convert form data to object
            const applicationData = {};
            formData.forEach((value, key) => {
                if (key === 'photo' || key === 'resume') {
                    // Handle file inputs
                    if (value.name) {
                        applicationData[key] = {
                            name: value.name,
                            type: value.type,
                            size: value.size
                        };
                    }
                } else {
                    applicationData[key] = value;
                }
            });
            
            // Add timestamp
            applicationData.submissionDate = new Date().toISOString();
            
            // Convert to JSON string
            const jsonData = JSON.stringify(applicationData, null, 2);
            
            // Create and download file
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `job_application_${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Show success message
            alert('ข้อมูลการสมัครงานของคุณถูกบันทึกเรียบร้อยแล้ว');
            
            // Reset form
            jobForm.reset();
        });
    }
});

// Add animation to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .about-image, .contact-form');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if(elementPosition < screenPosition) {
            element.classList.add('fade-in');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
