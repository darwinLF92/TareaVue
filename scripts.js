new Vue({
    el: '#app',
    data: {
        posts: [],
        searchQuery: '',
        newPost: {
            title: '',
            body: ''
        },
        selectedPost: null, // Si es null, estamos creando un nuevo post. Si tiene un valor, estamos editando ese post.
    },
    created() {
        this.fetchPosts();
    },
    methods: {
        fetchPosts() {
            this.$http.get('https://jsonplaceholder.typicode.com/posts').then(response => {
                this.posts = response.body;
            });
        },
        createPost() {
            if (this.selectedPost) {
                this.clearForm();
                let index = this.posts.findIndex(post => post.id === this.selectedPost.id);
                this.posts[index] = Object.assign({}, this.newPost);
                this.selectedPost = null;
            } else {
                this.$http.post('https://jsonplaceholder.typicode.com/posts', this.newPost).then(response => {
                    this.posts.push(response.body);
                    this.clearForm();
                });
            }
            this.newPost.title = '';
            this.newPost.body = '';
        },
        editPost(post) {
            this.newPost = Object.assign({}, post); // Clona el post seleccionado y asigna a newPost
            this.selectedPost = post;
        },
        clearForm() {
            this.newPost.title = '';
            this.newPost.body = '';
            this.selectedPost = null;
        }
    },
    computed: {
        filteredPosts() {
            return this.posts.filter(post => 
                post.title.includes(this.searchQuery) || 
                post.userId.toString() === this.searchQuery // Agregamos la condición para buscar por ID
            );
        },
        matchingPostCount() {
            return this.filteredPosts.length;
        }
    }
});
