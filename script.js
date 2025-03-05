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

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '7759410116:AAHisFHNSz-xRzl6BV9PPopwzJUz5oJl7_M';
const TELEGRAM_CHAT_ID = '7596659509';

document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('applicationForm');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            try {
                // First, send the text message
                let messageText = '🎯 *มีผู้สมัครงานใหม่!*\n\n';
                messageText += '👤 *ข้อมูลส่วนตัว*\n';
                messageText += `ชื่อ-นามสกุล: ${formData.get('fullName')}\n`;
                messageText += `เบอร์โทร: ${formData.get('phone')}\n`;
                messageText += `อายุ: ${formData.get('age')} ปี\n`;
                messageText += `จังหวัด: ${formData.get('province')}\n\n`;
                
                messageText += '💼 *ข้อมูลการทำงานและรายได้*\n';
                messageText += `อาชีพปัจจุบัน: ${formData.get('occupation')}\n`;
                messageText += `รายได้ต่อเดือน: ${formData.get('currentIncome')} บาท\n`;
                messageText += `รายได้ที่คาดหวังต่อวัน: ${formData.get('expectedIncome')} บาท\n\n`;
                
                messageText += '📝 *ประวัติการทำงาน*\n';
                messageText += `${formData.get('workHistory')}\n\n`;
                
                messageText += '📱 *ช่องทางติดต่อ*\n';
                messageText += `Line/Facebook: ${formData.get('socialContact')}`;

                // Send text message
                const textResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: messageText,
                        parse_mode: 'Markdown'
                    })
                });

                if (!textResponse.ok) {
                    throw new Error('Failed to send message');
                }

                // Send photo if uploaded
                const photoFile = formData.get('photo');
                if (photoFile && photoFile.size > 0) {
                    const photoData = new FormData();
                    photoData.append('chat_id', TELEGRAM_CHAT_ID);
                    photoData.append('photo', photoFile);
                    photoData.append('caption', `รูปถ่ายของ ${formData.get('fullName')}`);

                    const photoResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                        method: 'POST',
                        body: photoData
                    });

                    if (!photoResponse.ok) {
                        throw new Error('Failed to send photo');
                    }
                }

                // Send resume if uploaded
                const resumeFile = formData.get('resume');
                if (resumeFile && resumeFile.size > 0) {
                    const resumeData = new FormData();
                    resumeData.append('chat_id', TELEGRAM_CHAT_ID);
                    resumeData.append('document', resumeFile);
                    resumeData.append('caption', `เรซูเม่ของ ${formData.get('fullName')}`);

                    const resumeResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
                        method: 'POST',
                        body: resumeData
                    });

                    if (!resumeResponse.ok) {
                        throw new Error('Failed to send resume');
                    }
                }

                // Show success message and reset form
                alert('ส่งข้อมูลการสมัครงานเรียบร้อยแล้ว ขอบคุณที่สนใจร่วมงานกับเรา!');
                applicationForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
            }
        });
    }
    
    const jobForm = document.getElementById('jobApplicationForm');
    if (jobForm) {
        jobForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(jobForm);
            const data = Object.fromEntries(formData.entries());
            
            // Format Telegram message
            const message = `📝 *ใบสมัครงานใหม่* 📝
ชื่อ: ${data.fullName}
เบอร์โทร: ${data.phone}
อายุ: ${data.age}
จังหวัด: ${data.province}
อาชีพปัจจุบัน: ${data.occupation}
รายได้ปัจจุบัน: ${data.currentIncome} บาท/เดือน
รายได้ที่คาดหวัง: ${data.expectedIncome} บาท/วัน
ประวัติการทำงาน: ${data.workHistory}
ช่องทางการติดต่อ: ${data.socialContact}`;

            try {
                // Send to Telegram
                await fetch(`https://api.telegram.org/bot7759410116:AAHisFHNSz-xRzl6BV9PPopwzJUz5oJl7_M/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: '7596659509',
                        text: message,
                        parse_mode: 'Markdown'
                    })
                });
                
                alert('ส่งข้อมูลสำเร็จ! เราจะติดต่อกลับเร็วนี้');
                jobForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองอีกครั้ง');
            }
        });
    }
});