document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    // Gestion du menu hamburger
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('closed');
        content.classList.toggle('expanded');
        menuToggle.classList.toggle('closed');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('data-section');
            loadSection(section);
        });
    });

    function loadSection(section) {
        const content = getSectionContent(section);
        mainContent.innerHTML = content;
        // Initialiser TinyMCE sur les textarea injectés dynamiquement
        // if (window.tinymce) {
        //     initTinyMCE();
        // }
        setupEventListeners(section);
        loadArticleList(section);
    }

    // Initialise TinyMCE pour tous les textarea présents dans le DOM
    // function initTinyMCE() {
    //     // Détruire les instances existantes pour éviter duplication
    //     if (window.tinymce) {
    //         window.tinymce.remove();
    //     }

    //     tinymce.init({
    //         selector: 'textarea',
    //         menubar: false,
    //         plugins: ['link', 'lists', 'image', 'code', 'paste', 'autoresize'],
    //         toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | code',
    //         height: 300,
    //         branding: false,
    //         paste_as_text: true
    //     });
    // }

    function setupEventListeners(section) {
        const addForm = document.querySelector(`#${section}-add-form`);
        const editForm = document.querySelector(`#${section}-edit-form`);
        const searchForm = document.querySelector(`#${section}-search-form`);

        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleAddSubmit(section, addForm);
            });

            if (section === 'Sondages') {
                const addOptionButton = document.getElementById('add-option');
                const optionsContainer = document.getElementById('poll-options-container');

                addOptionButton.addEventListener('click', () => {
                    const newOption = document.createElement('div');
                    newOption.className = 'poll-option';
                    newOption.innerHTML = `<input type="text" name="options[]" placeholder="Nouvelle option" required>`;
                    optionsContainer.appendChild(newOption);
                });
            }
        }

        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleEditSubmit(section, editForm);
            });
        }

        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleSearch(section, searchForm);
            });
        }
    }
    let baseUrl =  'https://infobtp-website-indol.vercel.app' ; //http://localhost:5500' //'    // 
    let url = '';
    function handleAddSubmit(section, form) {
        // Si TinyMCE est utilisé, forcer la synchronisation du contenu vers les textarea
        // if (window.tinymce) {
        //     tinymce.triggerSave();
        // }
        const formData = new FormData(form);
        
        if (section === 'Sondages') {
            const question = formData.get('question');
            const options = formData.getAll('options[]');
            const sondageData = {
                question: question,
                options: options.map(text => ({ text }))
            };
            url = `${baseUrl}/sondages`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sondageData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Sondage créé avec succès:', data);
                showSuccessMessage('Votre sondage a été créé avec succès !');
                form.reset();
            })
            .catch(error => {
                console.error('Erreur lors de la création du sondage:', error);
                showErrorMessage('Une erreur est survenue lors de la création du sondage.');
            });
        } else {
            switch (section) {
                case 'Publi-reportage':
                    url = `${baseUrl}/publicreportage`;
                    break;
                case 'Economie':
                    url = `${baseUrl}/economie`;
                    break;
                case 'Interviews':
                    url = `${baseUrl}/interviews`;
                    break;
                case 'Video-Journalistiques':
                    url = `${baseUrl}/videosjournalistiques`;
                    break;
                case 'Enquetes-Exclusives':
                    url = `${baseUrl}/enquetesExclusives`;
                    break;
                case 'Institutions':
                    url = `${baseUrl}/institutions`;
                    break;
                case 'Opinion':
                    url = `${baseUrl}/opinions`;
                    break;
                case 'Faits-divers':
                    url = `${baseUrl}/divers`;
                    break;
                default:
                    console.error('Section non reconnue');
                    return;            }
            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Article ajouté avec succès :', data);
                mainContent.innerHTML = `
                <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; color: #2f855a; padding: 1rem; margin: 1rem 0; border-radius: 0.25rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" style="color: #48bb78; margin-right: 0.75rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                    <p style="font-weight: bold; margin: 0;">Ajout réussie !</p>
                    <p style="margin: 0;">Votre nouvelle article  de la section: ${section} a été Ajouté avec succès.</p>
                    </div>
                </div>
                `;
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de l\'article :', error);
                showErrorMessage('Une erreur est survenue lors de l\'ajout de l\'article.');
            });
        }
    }

    

    function showSuccessMessage(message) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.classList.remove('hide');
        messageContainer.classList.add('show');

        setTimeout(() => {
            messageContainer.classList.remove('show');
            messageContainer.classList.add('hide');
        }, 3000);
    }

    function showErrorMessage(message) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.style.backgroundColor = '#f44336';
        messageContainer.classList.remove('hide');
        messageContainer.classList.add('show');

        setTimeout(() => {
            messageContainer.classList.remove('show');
            messageContainer.classList.add('hide');
        }, 3000);
    }

    function handleEditSubmit(section, form) {
        // if (window.tinymce) {
        //     tinymce.triggerSave();
        // }
        const formData = new FormData(form);
        console.log(`Modification d'un article dans la section ${section}`);
        form.reset();
        loadArticleList(section);
    }

  

    function handleSearch(section, form) {
        const query = form.querySelector('input[name="search"]').value;
        console.log(`Recherche dans la section ${section} pour: ${query}`);
        switch (section) {
            case 'Publi-reportage':
                url = `${baseUrl}/publicreportage/search`;
                break;
            case 'Economie':
                url = `${baseUrl}/economie/search`;
                break;
            case 'Interviews':
                url = `${baseUrl}/interviews/search`;
                break;
            case 'Video-Journalistiques':
                url = `${baseUrl}/videosjournalistiques/search`;
                break;
            case 'Enquetes-Exclusives':
                url = `${baseUrl}/enquetesExclusives/search`;
                break;
            case 'Institutions':
                url = `${baseUrl}/institutions/search`;
                break;
            case 'Sondages':
                url = `${baseUrl}/sondages/search`;
                break;
            case 'Opinion':
                url = `${baseUrl}/opinions/search`;
                break;
            case 'Faits-divers':
                url = `${baseUrl}/divers/search`;
                break;
            default:
                console.error('Section non reconnue');
                return;
        }
        console.log(url)
        fetch(`${url}?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Résultats de la recherche:', data);
            if(data.message === 'Aucun article trouvé') {
                console.log("eeeeeeeeeeeeeee")
                mainContent.innerHTML = `
                <div style="background-color: #f5df95; border-left: 4px solid #48bb78; color: #2f855a; padding: 1rem; margin: 1rem 0; border-radius: 0.25rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" style="color: #48bb78; margin-right: 0.75rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                    <p style="font-weight: bold; margin: 0;">Aucun article dans la section: ${section} ne correspond à votre reccherche.</p>
                    <p style="margin: 0;"> Essayez avec une autre expression. </p>
                    </div>
                </div>`
            } else{
                displaySearchResults(data, section);
            }
            // Ici, vous devriez appeler une fonction pour afficher les résultats
           
        })
        .catch(error => {
            console.error('Erreur lors de la recherche:', error);
            showErrorMessage('Une erreur est survenue lors de la recherche.');
        });

        
        loadArticleList(section, query);
    }

    function displaySearchResults(results, section) {
        const articleList = document.querySelector(`#${section}-list`);
        switch (section) {
            case 'Sondages':
                mainContent.innerHTML = results.map(article => `
                    <div class="article-item" data-id="${article._id}" data-section="${section}">
                        <h3>${article.question}</h3>
                        ${article.options.map(item => ` <span><b>Option:</b> ${item.text}</span> <i><b>Votes:</b> ${item.votes}</i> <br>`).join('')}
                        <div class="article-actions">
                            <button class="edit-button">Modifier</button>
                            <button class="delete-button" data-section="${section}" data-id="${article._id}">Supprimer</button>
                        </div>
                    </div>
                `).join('');
                break;
            case 'Interviews':
            case 'Video-Journalistiques':
                mainContent.innerHTML = results.map(article => `
                    <div class="article-item" data-id="${article._id}" data-section="${section}">
                        <h3>${article.title}</h3>
                        <h4>${article.presenter}</h4>
                        <h4>${article.category}</h4>
                        <h4>${article.videoUrl}</h4>
                        <h4>${article.publicationDate}</h4>
                        <div class="article-actions">
                            <button class="edit-button">Modifier</button>
                        <button class="delete-button" data-section="${section}" data-id="${article._id}">Supprimer</button>                    </div>
                    </div>
                `).join('');
                break;
            
            default:
                mainContent.innerHTML = results.map(article => `
                    <div class="article-item" data-id="${article._id}" data-section="${section}">
                        <h3>${article.titres.grandTitre}</h3>
                        <h4>${article.titres.sousTitres[0].sousTitre}</h4>
                        <h4>${article.titres.sousTitres[1].sousTitre}</h4>
                        <div class="article-actions">
                            <button class="edit-button">Modifier</button>
                        <button class="delete-button" data-section="${section}" data-id="${article._id}">Supprimer</button>                    </div>
                    </div>
                `).join('');
        }
       
           
        
    
        mainContent.addEventListener('click', (e) => {
            
            if (e.target.classList.contains('edit-button') || e.target.classList.contains('delete-button')) {
                e.preventDefault();
                const articleItem = e.target.closest('.article-item');
                const id = articleItem.dataset.id;
                const section = articleItem.dataset.section;
                
                if (e.target.classList.contains('edit-button')) {
                    e.preventDefault();
                    handleEdit(section, id);
                } else if (e.target.classList.contains('delete-button')) {
                    e.preventDefault();
                    handleDelete(section, id);
                }
            }
        });

        setupDeleteButtons();
    }

    function setupDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            // Utiliser dataset pour stocker section et id
            const section = button.dataset.section;
            const id = button.dataset.id;
            // Retirer tout gestionnaire d'événement existant
            button.removeEventListener('click', handleDeleteClick);
            // Ajouter le nouveau gestionnaire d'événement
            button.addEventListener('click', handleDeleteClick);
        });
    }

    function handleDelete(section, id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            console.log(`Suppression de l'article ${id} dans la section ${section}`);
            switch (section) {
                case 'Publi-reportage':
                    url = `${baseUrl}/publicreportage/${id}`;
                    break;
                case 'Economie':
                    url = `${baseUrl}/economie/${id}`;
                    break;
                case 'Interviews':
                    url = `${baseUrl}/interviews/${id}`;
                    break;
                case 'Video-Journalistiques':
                    url = `${baseUrl}/videosjournalistiques/${id}`;
                    break;
                case 'Enquetes-Exclusives':
                    url = `${baseUrl}/enquetesExclusives/${id}`;
                    break;
                case 'Institutions':
                    url = `${baseUrl}/institutions/${id}`;
                    break;
                case 'Sondages':
                        url = `${baseUrl}/sondages/${id}`;
                        break;
                case 'Opinion':
                    url = `${baseUrl}/opinions/${id}`;
                    break;
                case 'Faits-divers':
                    url = `${baseUrl}/divers/${id}`;
                    break;
                default:
                    console.error('Section non reconnue');
                    return;
            }
        }

        fetch(url, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau ou serveur');
            }
            return response.json();
        })
        .then(data => {
            console.log('Article supprimé avec succès:', data);
            mainContent.innerHTML = `
            <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; color: #2f855a; padding: 1rem; margin: 1rem 0; border-radius: 0.25rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" style="color: #48bb78; margin-right: 0.75rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <div>
                <p style="font-weight: bold; margin: 0;">Suppression réussie !</p>
                <p style="margin: 0;">Votre article id:${id} de la section: ${section} a été supprimé avec succès.</p>
                </div>
            </div>
            `;
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'article:', error);
            showErrorMessage('Une erreur est survenue lors de la suppression de l\'article.');
            loadSection(`${section}`);

        });

       
    }

    function handleEdit(section, id) {
        let url = '';
        switch (section) {
            case 'Publi-reportage':
                url = `${baseUrl}/publicreportage/${id}`;
                break;
            case 'Economie':
                url = `${baseUrl}/economie/${id}`;
                break;
            case 'Interviews':
                url = `${baseUrl}/interviews/${id}`;
                break;
            case 'Video-Journalistiques':
                url = `${baseUrl}/videosjournalistiques/${id}`;
                break;
            case 'Enquetes-Exclusives':
                url = `${baseUrl}/enquetesExclusives/${id}`;
                break;
            case 'Institutions':
                url = `${baseUrl}/institutions/${id}`;
                break;
            case 'Opinion':
                url = `${baseUrl}/opinions/${id}`;
                break;
            case 'Faits-divers':
                url = `${baseUrl}/divers/${id}`;
                break;
            case 'Sondages':
                url = `${baseUrl}/sondages/${id}`;
                break;
            default:
                console.error('Section non reconnue');
                return;
        }
    
        fetch(url)
            .then(response => response.json())
            .then(article => {
                console.log(article);
                switch (section) {
                    case 'Sondages':
                        mainContent.innerHTML = `
                    <div class="article-item" data-id="${article._id}" data-section="${section}">

                        <div id="message-container" class="message-container"></div>
                        <form class="edit-form" id="edit-form-${article._id}">
                            <label for="question-${article._id}">Le Grand Titre :</label>
                            <input type="text" name="question" id="question" value="${article.question}" required>
                            
                            <button type="submit" class="edit-button">Modifier</button>
                        </form>
                    </div>
                `;
                        break;
                    case 'Interviews':
                        mainContent.innerHTML = `
                        <div class="article-item" data-id="${article._id}" data-section="${section}">
                            <div id="message-container" class="message-container"></div>
                            <form class="edit-form" id="edit-form-${article._id}" enctype="multipart/form-data">
                                <label for="title-${article._id}">Titre Interview :</label>
                                <input type="text" name="title" id="title-${article._id}" value="${article.title}" required>
                                
                                <label for="presenter-${article._id}">Nom du présentateur :</label>
                                <input type="text" name="presenter" id="presenter-${article._id}" value="${article.presenter}" required>
                                
                                <label for="currentVideo-${article._id}">Vidéo actuelle :</label>
                                <video src="${article.videoUrl}" controls style="max-width: 200px;"></video>
                                <label for="newVideo-${article._id}">Changer la vidéo :</label>
                                <input type="file" id="newVideo-${article._id}" name="videoUrl" accept="video/*">
                                
                                <label for="currentMiniature-${article._id}">Miniature actuelle :</label>
                                <img src="${article.interviewsMiniature}" alt="Miniature actuelle" style="max-width: 200px;">
                                <label for="newMiniature-${article._id}">Changer la miniature :</label>
                                <input type="file" id="newMiniature-${article._id}" name="interviewsMiniature" accept="image/*">
                                
                                <label for="category-${article._id}">Catégorie :</label>
                                <input type="text" name="category" id="category-${article._id}" value="${article.category}" required>
                                
                                <button type="submit" class="edit-button">Modifier</button>
                            </form>
                        </div>
                        `;
                        break;
                        case 'Video-Journalistiques':
                            mainContent.innerHTML = `
                            <div class="article-item" data-id="${article._id}" data-section="${section}">
                                <div id="message-container" class="message-container"></div>
                                <form class="edit-form" id="edit-form-${article._id}" enctype="multipart/form-data">
                                    <label for="title-${article._id}">Titre De la Video Journalistique :</label>
                                    <input type="text" name="title" id="title-${article._id}" value="${article.title}" required>
                                    
                                    <label for="presenter-${article._id}">Nom du présentateur :</label>
                                    <input type="text" name="presenter" id="presenter-${article._id}" value="${article.presenter}" required>
                                    
                                    <label for="currentVideo-${article._id}">Vidéo actuelle :</label>
                                    <video src="${article.videoUrl}" controls style="max-width: 200px;"></video>
                                    <label for="newVideo-${article._id}">Changer la vidéo :</label>
                                    <input type="file" id="newVideo-${article._id}" name="videoUrl" accept="video/*">
                                    
                                    <label for="currentMiniature-${article._id}">Miniature actuelle :</label>
                                    <img src="${article.interviewsMiniature}" alt="Miniature actuelle" style="max-width: 200px;">
                                    <label for="newMiniature-${article._id}">Changer la miniature :</label>
                                    <input type="file" id="newMiniature-${article._id}" name="interviewsMiniature" accept="image/*">
                                    
                                    <label for="category-${article._id}">Catégorie :</label>
                                    <input type="text" name="category" id="category-${article._id}" value="${article.category}" required>
                                    
                                    <button type="submit" class="edit-button">Modifier</button>
                                </form>
                            </div>
                            `;
                    default:
                        mainContent.innerHTML = `
                    <div class="article-item" data-id="${article._id}" data-section="${section}">

                        <div id="message-container" class="message-container"></div>
                        <form class="edit-form" id="edit-form-${article._id}">
                            <label for="grandTitre-${article._id}">Le Grand Titre :</label>
                            <input type="text" name="grandTitre" id="grandTitre-${article._id}" value="${article.titres.grandTitre}" required>
                            
                            <label for="contenuGrandTitre-${article._id}">Contenu du grand titre :</label>
                            <textarea name="contenuGrandTitre" id="contenuGrandTitre-${article._id}" required>${article.titres.contenuGrandTitre}</textarea>
                            
                            <label for="sousTitre1-${article._id}">Sous Titre 1 :</label>
                            <input type="text" name="sousTitre1" id="sousTitre1-${article._id}" value="${article.titres.sousTitres[0].sousTitre}" >
                            
                            <label for="contenuSousTitre1-${article._id}">Contenu du sous titre 1 :</label>
                            <textarea name="contenuSousTitre1" id="contenuSousTitre1-${article._id}" >${article.titres.sousTitres[0].contenuSousTitre}</textarea>
                            
                            <label for="sousTitre2-${article._id}">Sous Titre 2 :</label>
                            <input type="text" name="sousTitre2" id="sousTitre2-${article._id}" value="${article.titres.sousTitres[1].sousTitre}" >
                            
                            <label for="contenuSousTitre2-${article._id}">Contenu du sous titre 2 :</label>
                            <textarea name="contenuSousTitre2" id="contenuSousTitre2-${article._id}" >${article.titres.sousTitres[1].contenuSousTitre}</textarea>
                            
                            <label for="auteur-${article._id}">Auteur:</label>
                            <input type="text" name="auteur" id="auteur-${article._id}" value="${article.auteur}" required>
                            
                            <label for="categorie-${article._id}">Categorie de l'article :</label>
                            <input type="text" name="categorie" id="categorie-${article._id}" value="${section}" required>
                            
                            <label for="tags-${article._id}">Tags :</label>
                            <input type="text" name="tags" id="tags-${article._id}" value="${article.tags.join(', ')}" required>
                            
                            <label for="image-${article._id}">Image principale actuelle :</label>
                            <img src="${article.imageGrandTitre}" alt="Image principale actuelle" style="max-width: 200px;">
                            <label for="newImage-${article._id}">Changer l'image principale :</label>
                            <input type="file" id="newImage-${article._id}" name="imageGrandTitre" accept="image/*">
                            
                            <label for="imageSousTitre1-${article._id}">Image sous-titre 1 actuelle :</label>
                            <img src="${article.titres.sousTitres[0].imageSousTitre}" alt="Image sous-titre 1" style="max-width: 200px;">
                            <label for="newImageSousTitre1-${article._id}">Changer l'image sous-titre 1 :</label>
                            <input type="file" id="newImageSousTitre1-${article._id}" name="imageSousTitre1" accept="image/*">
                            
                            <label for="imageSousTitre2-${article._id}">Image sous-titre 2 actuelle :</label>
                            <img src="${article.titres.sousTitres[1].imageSousTitre}" alt="Image sous-titre 2" style="max-width: 200px;">
                            <label for="newImageSousTitre2-${article._id}">Changer l'image sous-titre 2 :</label>
                            <input type="file" id="newImageSousTitre2-${article._id}" name="imageSousTitre2" accept="image/*">

                           
                            ${section === 'BTP Video' || section === 'Video Journalistiques' ? 
                                `<label for="videoUrl-${article._id}">URL de la vidéo :</label>
                                <input type="url" name="videoUrl" id="videoUrl-${article._id}" value="${article.videoUrl}" required>` 
                                : ''}
                            
                            <button type="submit" class="edit-button">Modifier</button>
                        </form>
                    </div>
                `;
                }
                
    
                const editForm = document.getElementById(`edit-form-${article._id}`);
                console.log(article._id)
                editForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(editForm);
                    console.log(url)
                    fetch(url, {
                        method: 'PUT',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Article modifié avec succès:', data);
                        showSuccessMessage('Votre article a été modifié avec succès !');
                        mainContent.innerHTML = `
                        <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; color: #2f855a; padding: 1rem; margin: 1rem 0; border-radius: 0.25rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); display: flex; align-items: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" style="color: #48bb78; margin-right: 0.75rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <div>
                            <p style="font-weight: bold; margin: 0;">Modification réussie !</p>
                            <p style="margin: 0;">Votre article id:${id} de la section: ${section} a été modifié avec succès.</p>
                            </div>
                        </div>
                        `;
                    })
                    .catch(error => {
                        console.error('Erreur lors de la modification de l\'article:', error);
                        showErrorMessage('Une erreur est survenue lors de la modification de l\'article.');
                    });
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des détails de l\'article:', error);
                showErrorMessage('Une erreur est survenue lors de la récupération des détails de l\'article.');
            });

            
    }

    function loadArticleList(section, query = '') {
        const articleList = document.querySelector(`#${section}-list`);
        // Simulation d'une liste d'articles
        const articles = [
            { id: 1, title: 'Article 1', content: 'Contenu 1' },
            { id: 2, title: 'Article 2', content: 'Contenu 2' },
            { id: 3, title: 'Article 3', content: 'Contenu 3' },
        ];
    }


    function fetchContacts() {
        url = `${baseUrl}/contact`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const contactsList = document.getElementById('contacts-list');
                contactsList.innerHTML = '';
                data.forEach(contact => {
                    const contactCard = document.createElement('div');
                    contactCard.className = 'contact-card';
                    contactCard.innerHTML = `
                        <h4>${contact.name}</h4>
                        <p><strong>Email:</strong> ${contact.email}</p>
                        <p><strong>Sujet:</strong> ${contact.subject}</p>
                        <p><strong>Message:</strong> ${contact.message}</p>
                        <p><strong>Date:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
                         <button class="view-detail" data-id="${contact._id}">Voir détails</button>

                    `;
                    contactsList.appendChild(contactCard);
                });
                addContactDetailListeners();

            })
            .catch(error => console.error('Error fetching contacts:', error));
    }

    function fetchSubscribers() {
        url = `${baseUrl}/abonnement`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const subscribersList = document.getElementById('subscribers-list');
                subscribersList.innerHTML = '';
                data.forEach(subscriber => {
                    const subscriberCard = document.createElement('div');
                    subscriberCard.className = 'subscriber-card';
                    subscriberCard.innerHTML = `
                        <h4>${subscriber.email}</h4>
                        <p><strong>Date d'inscription:</strong> ${new Date(subscriber.createdAt).toLocaleString()}</p>
                        <button class="delete-btn" data-id="${subscriber._id}">Supprimer</button>
                        `;
                    subscribersList.appendChild(subscriberCard);
                    addDeleteSubscriberListener(subscriber._id);

                });
                addDeleteSubscriberListener();
            })
            .catch(error => console.error('Error fetching subscribers:', error));
    }



    function addContactDetailListeners() {
        document.querySelectorAll('#contacts-list .view-detail').forEach(button => {
            button.addEventListener('click', (e) => {
                const contactId = e.target.getAttribute('data-id');
                fetchContactDetail(contactId);
            });
        });
    }
    
    // function addSubscriberDetailListeners() {
    //     document.querySelectorAll('#subscribers-list .view-detail').forEach(button => {
    //         button.addEventListener('click', (e) => {
    //             const subscriberId = e.target.getAttribute('data-id');
    //             fetchSubscriberDetail(subscriberId);
    //         });
    //     });
    // }
    
    function fetchContactDetail(contactId) {
        url = `${baseUrl}/contact/${contactId}`
        fetch(url)
            .then(response => response.json())
            .then(contact => {
                const detailView = document.createElement('div'); // Créer un nouvel élément div
                detailView.className = 'detail-view'; // Ajouter une classe si nécessaire
                mainContent.innerHTML = `
                    <div class="detail-card">
                        <h3>${contact.name}</h3>
                        <p><strong>Email:</strong> ${contact.email}</p>
                        <p><strong>Sujet:</strong> ${contact.subject}</p>
                        <p><strong>Message:</strong> ${contact.message}</p>
                        <p><strong>Date:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
                        <button class="delete-btn" data-id="${contact._id}">Supprimer</button>
                    </div>
                `;
                //mainContent.appendChild(detailView);
                addDeleteContactListener(contact._id);
            })
            .catch(error => console.error('Error fetching contact detail:', error));
    }
    
    // function fetchSubscriberDetail(subscriberId) {
    //     url = `${baseUrl}/abonnement/${subscriberId}`
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(subscriber => {
    //             const detailView = document.createElement('div'); // Créer un nouvel élément div
    //             detailView.className = 'detail-view'; // Ajouter une classe si nécessaire
    //             detailView.innerHTML = `
    //                 <div class="detail-card">
    //                     <h3>${subscriber.email}</h3>
    //                     <p><strong>Date d'inscription:</strong> ${new Date(subscriber.createdAt).toLocaleString()}</p>
    //                     <button class="delete-btn" data-id="${subscriber._id}">Supprimer</button>
    //                 </div>
    //             `;
    //             mainContent.appendChild(detailView);
    //             addDeleteSubscriberListener(subscriber._id);
    //         })
    //         .catch(error => console.error('Error fetching subscriber detail:', error));
    // }
    
    function addDeleteContactListener(contactId) {
        document.querySelector(`.detail-card .delete-btn[data-id="${contactId}"]`).addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
                deleteContact(contactId);
            }
        });
    }
    
    function addDeleteSubscriberListener(subscriberId) {
        document.querySelector(`.subscriber-card .delete-btn[data-id="${subscriberId}"]`).addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) {
                deleteSubscriber(subscriberId);
            }
        });
    }
    
    function deleteContact(contactId) {
        url = `${baseUrl}/contact/${contactId}`
        fetch(url, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => {
                alert('Contact supprimé avec succès');
                mainContent.innerHTML = `
                <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; color: #2f855a; padding: 1rem; margin: 1rem 0; border-radius: 0.25rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" style="color: #48bb78; margin-right: 0.75rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                    <p style="font-weight: bold; margin: 0;">Suppression réussie !</p>
                    <p style="margin: 0;">Contact Supprimé avec succès.</p>
                    </div>
                </div>
                `;
            })
            .catch(error => console.error('Error deleting contact:', error));
    }
    
    function deleteSubscriber(subscriberId) {
        url = `${baseUrl}/abonnement/${subscriberId}`
        fetch(url, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => {
                alert('Abonné supprimé avec succès');
                fetchSubscribers();
                document.getElementById('subscriber-detail').innerHTML = '';
            })
            .catch(error => console.error('Error deleting subscriber:', error));
    }

    function getSectionContent(section) {
        let text = `
            <h3>Rechercher un article ${section}</h3>
             <form id="${section}-search-form">
                 <input type="text" name="search" placeholder="Rechercher...">
                <button type="submit">Rechercher</button>
             </form>
             <br>
             <br>
             <br>
            <h2>Ajouter un article</h2>
            <form id="${section}-add-form">
                <div id="message-container" style="display: block;" class="message-container"></div>
                <label for="grandTitre">Le Grand Titre :</label>
                <input type="text" name="grandTitre" placeholder="Grand Titre" required>
                <label for="contenuGrandTitre">Contenu du grand titre :</label>
                <textarea name="contenuGrandTitre" placeholder="Contenu du Grand titre" required></textarea>
                <label for="image">Télécharger l'image principale :</label>
                <input type="file" id="image" name="imageGrandTitre" accept="image/*" required>
                
                <label for="sousTitre1">Sous Titre 1 :</label>
                <input type="text" name="sousTitre1" placeholder="Sous Titre 1" >
                <label for="contenuSousTitre1">Contenu du sous titre 1 :</label>
                <textarea name="contenuSousTitre1"  placeholder="Contenu du sous titre 1"></textarea>
                <label for="imageSecondaire1">Image du sous titre 1 (optionnelle) :</label>
                <input type="file" id="imageSecondaire1" name="imageSecondaire1" accept="image/*">
                
                <label for="sousTitre2">Sous Titre 2 :</label>
                <input type="text" name="sousTitre2" placeholder="Sous Titre 2" >
                <label for="sousTitre2">Contenu du sous titre 2 :</label>
                <textarea name="contenuSousTitre2" placeholder="Contenu du sous titre 2" ></textarea>
                <label for="imageSecondaire2">Image du sous titre 2 (optionnelle) :</label>
                <input type="file" id="imageSecondaire2" name="imageSecondaire2" accept="image/*">

                
                <label for="externalLink">Ajouté un lien externe :</label>
                <input type="text" name="externalLink" placeholder="www.http://exemple.com" required>
                <label for="externalLinkTitle">Titre du lien externe :</label>
                <input type="text" name="externalLinkTitle" placeholder="Titre du lien" required>
                <label for="auteur">Auteur:</label>
                <input type="text" name="auteur" placeholder="Nom de l'auteur de l'article" required>
                <label for="categorie">Categorie de l'article :</label>
                <input type="text" name="categorie" value="${section}" placeholder="categorie" required>
                <label for="tags">Tags :</label>
                <input type="text" name="tags" id="tags" placeholder="Ajouter des tags séparés par des virgules" required>
                
                ${section === 'BTP Video' || section === 'Video Journalistiques' ? '<input type="url" name="videoUrl" placeholder="URL de la vidéo" required>' : ''}
                <button type="submit">Ajouter</button>
            </form>
        `;

        let videoInterview = `
            <h3>Rechercher un article ${section}</h3>
             <form id="${section}-search-form">
                 <input type="text" name="search" placeholder="Rechercher...">
                <button type="submit">Rechercher</button>
             </form>
             <br>
             <br>
             <br>
            <h2>Ajouter un article</h2>
            <form id="${section}-add-form" enctype="multipart/form-data">
                <div id="message-container" style="display: block;" class="message-container"></div>
                <label for="title">Titre Interview:</label>
                <input type="text" name="title" placeholder="Entrer le titre de la vidéo" required>
                <label for="presenter">Nom du présentateur :</label>
                <input type="text" name="presenter" placeholder="Nom du présentateur" required>
                <label for="videoUrl">Entrer URL la vidéo :</label>
                <input type="text" name="videoUrl" accept="video/*" required>
                <label for="interviewsMiniature">Télécharger la miniature :</label>
                <input type="file" name="interviewsMiniature" accept="image/*" required>
                <label for="category">Catégorie :</label>
                <input type="text" name="category" placeholder="Catégorie" value="${section}" required>
                <button type="submit">Ajouter</button>
            </form>
        `;


        let videoJOurnal = 
        `
            <h3>Rechercher un article ${section}</h3>
             <form id="${section}-search-form">
                 <input type="text" name="search" placeholder="Rechercher...">
                <button type="submit">Rechercher</button>
             </form>
             <br>
             <br>
             <br>
            <h3>Ajouter un article</h3>

            <form id="${section}-add-form" enctype="multipart/form-data">
                <div id="message-container" style="display: block;" class="message-container"></div>

                <label for="title">Titre Video Juurnalisque:</label>
                <input type="text" name="title" placeholder="Entrer le titre de la vidéo" required>

                <label for="presenter">Nom de l'auteur :</label>
                <input type="text" name="presenter" placeholder="Nom du présentateur" required>
                
                <label for="videoUrl">Télécharger la vidéo :</label>
                <input type="text" name="videoUrl" accept="video/*" required>

                <label for="interviewsMiniature">Télécharger la miniature :</label>
                <input type="file" name="interviewsMiniature" accept="image/*" required>

                <label for="category">Catégorie :</label>
                <input type="text" name="category" placeholder="Catégorie" value="${section}" required>
                
                <button type="submit">Ajouter</button>
            </form>
           
             
        
        `

        let sondages = `
            <h3>Rechercher un article ${section}</h3>
             <form id="${section}-search-form">
                 <input type="text" name="search" placeholder="Rechercher...">
                <button type="submit">Rechercher</button>
             </form>
             <br>
             <br>
             <br>
            <h2>Ajouter un sondage</h2>
            <form id="${section}-add-form">
                <div id="message-container" style="display: block;" class="message-container"></div>
                <label for="question">Question du sondage :</label>
                <input type="text" name="question" id="question" placeholder="Entrez la question du sondage" required>
                <div id="poll-options-container">
                    <label>Options de réponse :</label>
                    <div class="poll-option">
                        <input type="text" name="options[]" placeholder="Option 1" required>
                    </div>
                    <div class="poll-option">
                        <input type="text" name="options[]" placeholder="Option 2" required>
                    </div>
                </div>
                <button type="button" id="add-option">Ajouter une option</button>
                <button type="submit">Créer le sondage</button>
            </form>
           
        `;

        let contacts = `
        <h2>Gestion des ${section}</h2>
        <div id="contacts-container" class="data-container">
            <h3>Liste des Messages reçus</h3>
            <div id="contacts-list" class="data-list"></div>
        </div>
    `;

    let subscribers = `
        <h2>Gestion des ${section}</h2>
        <div id="subscribers-container" class="data-container">
            <h3>Liste des Abonnés</h3>
            <div id="subscribers-list" class="data-list"></div>
        </div>
    `;

        if(section === "Interviews") {
            return `<h2>Gestion des ${section}</h2>${videoInterview}`;
        } else if(section === "Video-Journalistiques") {
            return `<h2>Gestion des ${section}</h2>${videoJOurnal}`;
        } else if(section === "Sondages") {
            return `<h2>Gestion des ${section}</h2>${sondages}`;
        }else if(section === "Message") {
            return `${contacts}
                ${fetchContacts()}
            `;
        }else if(section === "Abonnes") {
            return `${subscribers}
                ${fetchSubscribers()}
            `;
        }  else {
            return `<h2>Gestion des ${section}</h2>${text}`;
        }

        
    }

    loadSection('Publi-reportage');
});
