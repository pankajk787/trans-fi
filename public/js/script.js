(() => {
    const dropZone = document.querySelector('.drop-zone');
    const fileInput = document.querySelector('#file-input');
    const browseBtn = document.querySelector('.upload-btn');
    const progressContainer = document.querySelector('.progress-container');
    const bgProgress = document.querySelector('.bg-progress');
    const percentDetails = document.querySelector('.progress-percent');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const sharingContainer = document.querySelector('.sharing-container');
    const copyBtn = document.querySelector('.copy-btn');
    const fileUrlInput = sharingContainer.querySelector('#file-url');
    const emailForm = document.querySelector('#email-form');

    // const apiDomain = 'http://localhost:5000';
    const apiDomain = '';

    dropZone.addEventListener('dragover', (e) => {
        console.log("dragover::::", e.dataTransfer.files?.length)
        e.preventDefault()
        if(!dropZone.classList.contains('dragged')) {
            dropZone.classList.add('dragged')
        }
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragged')
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragged');
        const files = e.dataTransfer.files;
        if(files.length > 0) {
            fileInput.files = files;
            uploadFile();
        }
    });

    browseBtn.addEventListener('click', () => {
        fileInput.click()
    })

    fileInput.addEventListener('change', (e) => {
        uploadFile();
    });

    copyBtn.addEventListener('click', () => {
        copyContent(fileUrlInput.value);
    });

    document.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });


    const uploadFile = () => {
        progressContainer.style.display = 'flex';

        const formData = new FormData();
        const file = fileInput.files[0];
        formData.append('myfile', file);

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status === 200) {
                    const response = JSON.parse(xhr.response);
                    onUploadSuccess(response.file);
                }
                else {
                    console.error("Error in uploading file, Failed with status: ", xhr.status);
                }
            }
        }

        xhr.upload.onprogress = onFileUploadProgress;

        xhr.onerror = () => {
            console.error("Error in uploading file, Failed with status: ", xhr.status);
        }

        xhr.open('POST', `${apiDomain}/api/files`);

        xhr.send(formData);
    }

    const onFileUploadProgress = (e) => {
        const progressPercentage = Math.round((e.loaded / e.total) * 100);

        bgProgress.style.transform = `scaleX(${progressPercentage / 100})`;
        progressBarFill.style.transform = `scaleX(${progressPercentage / 100})`;
        percentDetails.innerText = `${progressPercentage}%`;
    }


    const onUploadSuccess = (url) => {
        fileInput.value = '';
        emailForm.reset();
        progressContainer.style.display = 'none';
        fileUrlInput.value = url;
        sharingContainer.style.display = 'flex';
    }

    const copyContent = (content) => {
        navigator.clipboard.writeText(content);
        showToast("Copied to clipboard!", "info");
        console.log("Copied to clipboard: ", content);
    }

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(emailForm);
        const email_from = formData.get('email_from');
        const email_to = formData.get('email_to');
        const uuid = fileUrlInput.value.split('/').pop();
        const sendEmailUrl = `${apiDomain}/api/files/send`;
        const sendEmailBtn = sharingContainer.querySelector('.send-btn');
        sendEmailBtn.setAttribute('disabled', true);
        fetch(sendEmailUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email_from, email_to, uuid })
        }).then(res => res.json())
        .then(data => {
            console.log("Response: ", data);
            if(data.success) {
                sharingContainer.style.display = 'none';
                showToast("Email sent successfully!", "info");
                console.log("Email sent successfully: ", data);
            }
            else {
                console.error("Error in sending email: ", data);
                showToast("Error in sending email!", "error");
            }
        }).catch(e => {
            console.error("Error in sending email: ", e);
            showToast("Error in sending email!", "error");
        })
        .finally(() => {
            sendEmailBtn.removeAttribute('disabled');
        });
    });

    function showToast(message, type) {
        const toast = document.querySelector('.toast');
        toast.innerText = message;
        toast.classList.add(type);
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.remove(type);
        }, 3000);
    }
})();