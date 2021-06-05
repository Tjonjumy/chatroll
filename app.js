
const formElement = document.getElementById('applyForm');
const inputImgElm = document.getElementById('attachFile');
const nameImgElm = document.querySelector('.attach-container > label');
nameImgElm.setAttribute('data-after', 'Đính kèm hình ảnh');
const url = 'https://freemind-test.netlify.app/.netlify/functions/test';
const alertBoxElm = document.querySelector('.alert-box');
const messageElm = document.querySelector('.alert-box .message');
const layerElm = document.querySelector('.layer');

formElement.addEventListener('submit', e => {
    e.preventDefault();
    sendCv();
})

validator();

function sendCv() {
    const data = {};
    const formElementLength = formElement.length;
    for (let i = 0; i < formElementLength; i++) {
        const fieldName = formElement.elements[i].name;
        const fieldValue = formElement.elements[i].value;
        if (fieldName) {
            if (fieldName === 'picture' && fieldValue) {
                data[fieldName] = inputImgElm.files[0].name;
                continue;
            }
            data[fieldName] = fieldValue;
        }
    }
    sendRequest(url, data);
}

function validator() {
    const formElementLength = formElement.length;
    for (let i = 0; i < formElementLength; i++) {
        const fieldName = formElement.elements[i].name;
        formElement.elements[i].addEventListener('input', (e) => {
            if (e) {
                const value = e.target.value;
                if (fieldName === 'name') {
                    if (value.trim().indexOf(' ') < 0) {
                        e.target.setCustomValidity('Vui lòng nhập cả họ và tên');
                    } else {
                        e.target.setCustomValidity('');
                    }
                } else if (fieldName === 'phone') {
                    if (value.length < 10 || value.length > 12) {
                        e.target.setCustomValidity('Số điện thoại phải gồm 10 - 12 chữ số');
                    } else {
                        e.target.setCustomValidity('');
                    }
                } else if (fieldName === 'picture') {
                    const imgName = inputImgElm.files[0].name;
                    nameImgElm.setAttribute('data-after', imgName);
                }
            }
        })
    }
}

function sendRequest(url, data) {
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            messageElm.innerHTML = `Thông tin đã gửi đi thành công! <br />Chúng tôi sẽ sớm liên hệ lại với bạn qua email.`;
            layerElm.style.display = 'block';
            alertBoxElm.style.display = 'block';
            return data;
        })
        .catch((error) => {
            messageElm.innerHTML = `Đã có lỗi xảy ra! <br />Vui lòng gửi lại thông tin.`;
            layerElm.style.display = 'block';
            alertBoxElm.style.display = 'block';
            return error;
        })
}

function closeAlert() {
    alertBoxElm.style.display = 'none';
    layerElm.style.display = 'none';
}