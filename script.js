document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadUrl = 'https://raw.githubusercontent.com/Akshay-cp7/gyro_air/main/dist/GyroAir.exe';
    
    // Add click handler to download button
    downloadBtn.addEventListener('click', function() {
        startDownload();
    });
    
    function startDownload() {
        // Add downloading state
        downloadBtn.classList.add('downloading');
        
        // Create a temporary link element for download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'GyroAir.exe';
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Reset button after 3 seconds
        setTimeout(() => {
            downloadBtn.classList.remove('downloading');
            showDownloadSuccess();
        }, 3000);
    }
    
    function showDownloadSuccess() {
        const originalText = downloadBtn.querySelector('.btn-text').textContent;
        downloadBtn.querySelector('.btn-text').textContent = 'Downloaded!';
        downloadBtn.style.background = 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            downloadBtn.querySelector('.btn-text').textContent = originalText;
            downloadBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 2000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
        });
    });
});
