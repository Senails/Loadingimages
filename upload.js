export function upload(selector, options = {}) {
    let files;
    let load;
    let input = document.querySelector(selector);
    let preview = document.createElement('div');
    preview.classList.add('preview')


    let open = document.createElement('button');
    open.classList.add('btn');
    open.innerHTML = 'Открыть';

    input.insertAdjacentElement('afterend', open);
    open.insertAdjacentElement('afterend', preview);

    input.addEventListener('change', changehandler);

    if (options.multy) {
        input.setAttribute('multiple', true);
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','));
    }

    async function changehandler(event) {
        if (!this.files.length) return
        let fileList = this.files;
        files = Array.from(fileList);
        renderPreview(files);

        load = document.createElement('button');
        load.classList.add('btn');
        load.innerHTML = 'Загрузить';
        open.insertAdjacentElement('afterend', load);
        load.addEventListener('click', golaod);

        this.value = '';
    };

    function renderPreview(files) {
        preview.innerHTML = '';

        files.forEach((file) => {
            if (!file.type.match('image')) return
            let reader = new FileReader();

            reader.addEventListener('loadend', (e) => {
                let data = e.target.result;

                let img = document.createElement('div');
                img.classList.add('previewimage');
                img.style.backgroundImage = `url(${data})`;

                let remove = document.createElement('div');
                remove.classList.add('remove');
                remove.innerHTML = '&times;';
                remove.dataset.name = file.name;
                img.appendChild(remove);
                img.innerHTML += `
                <div class="info">
                    <span>${file.name}</span>
                    <span>${correctsize(file.size)}</span>
                </div>
                `

                preview.appendChild(img);
            })

            reader.readAsDataURL(file)
        })
    }

    preview.addEventListener('click', function(e) {
        if (!e.target.dataset.name) return
        let name = e.target.dataset.name;

        files = files.filter((file) => file.name !== name);
        let block = preview.querySelector(`.remove[data-name="${name}"]`).parentElement;
        block.classList.add('removing');

        setTimeout(() => {
            block.remove();
            if (!files.length) load.remove();
        }, 300)
    })

    open.addEventListener('click', trigerinput);

    function trigerinput() { input.click(); };

    function golaod() {
        document.querySelectorAll('.remove').forEach(elem => elem.remove());
        let previews = document.querySelectorAll('.info')
        previews.forEach(elem => {
            elem.classList.add('show');
            elem.innerHTML = `<div class="progres"><div>`
        });
        options.onUpload(files, previews)
    }
}

//utils
function correctsize(num) {
    let num1 = +num;
    let i = 0;
    while (true) {
        if (num1 / 100 > 1) {
            i++;
            num1 = num1 / 1024;
            continue;
        }
        break;
    }
    let srt = ('' + num1).slice(0, 4);
    let arr = ['B', 'KB', 'MB', 'GB', "TB"];
    return srt + arr[i];
}

//