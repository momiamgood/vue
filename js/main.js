let eventBus = new Vue ()

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Details'">
            <product-info></product-info>
       </div>
       <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }}</p> 
       </div>
     </div>

 `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Details', 'Shipping'],
            selectedTab: 'Reviews'  // устанавливается с помощью @click
        }
    },
    computed: {
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
             <p v-if="errors.length">
             <b>Please correct the following error(s):</b>
             <ul>
               <li v-for="error in errors">{{ error }}</li>
             </ul>
            </p>

             <p>
               <label for="name">Name:</label>
               <input id="name" v-model="name" placeholder="name">
             </p>
         
            
             <p>
               <label for="review">Review:</label>
               <textarea id="review" v-model="review"></textarea>
             </p>
            
             <p>
               <label for="rating">Rating:</label>
               <select id="rating" v-model.number="rating">
                 <option>5</option>
                 <option>4</option>
                 <option>3</option>
                 <option>2</option>
                 <option>1</option>
               </select>
             </p>
            
            <p>Would you recommend this product?:</p>
            <div class="radio">
               <label for="yes">Yes</label>
               <input id="recommendation" type="radio" value="yes" v-model.recommend="recommend">
               <label for="no">No</label>
               <input id="recommendation" type="radio" value="no" v-model.recommend="recommend">
               
            </div>
             <p>
               <input type="submit" value="Submit"> 
             </p>
        </form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommend required.")
            }
        }
    }
})


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
       <div class="product">
            <div class="product-image">
                    <img  
                    :src="image" :alt="altText" id="img"/>
                    <img  
                    :src="image" :alt="altText" id="duplicate"/>
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{ disc }}</p>
                <p v-if="inStock">In stock</p>
                <p v-else :class="{ outOfStock: !inStock }">Out of stock</p>
                <span v-if="onSale">{{ on_sale }}</span>
                <p>Colors:</p>
                <div
                        class="color-box"
                        v-for="(variant, index) in variants"
                        :key="variant.variantId"
                        :style="{ backgroundColor:variant.variantColor }"
                        @mouseover="updateProduct(index)"
                >
                </div>
                <ul>Sizes:
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>
                <product-info></product-info>
                <div class="btns">
                    <button v-on:click="addToCart"
                     :disabled="!inStock" 
                     :class="{ disabledButton: !inStock }"
                     class="add"
                     @click="animImg"
                    >Add to cart</button>
                    <button v-on:click="deleteFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock }"
                    >Delete from cart</button>
                </div>
            </div>
            <product-tabs :reviews="reviews"></product-tabs>
        </div>
`,
    data() {
        return {
            product: "Socks",
            disc: "A pair of warm, fuzzy socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: 1,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 10
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        deleteFromCart() {
            this.$emit('del-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        animImg(){
            let img = document.getElementById('img');
            let img_duplicate = document.getElementById('duplicate');
            let imgCoords = img.getBoundingClientRect();

            img_duplicate.style.left = imgCoords.left + 'px';
            img_duplicate.style.right = imgCoords.right + 'px';
            img_duplicate.style.visibility = 'visible';
            img_duplicate.classList.add('anim');

            function nullStyles (img, imgCoords) {
                img.style.left = imgCoords.left + 'px';
                img.style.right = imgCoords.right + 'px';
                img.style.visibility = 'hidden';
                img.classList.remove('anim');
            }

            setTimeout(nullStyles, 500, img_duplicate, imgCoords);

        }

    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        on_sale() {
            return this.brand + ' ' + this.product + ' ' + " on sale";
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})


Vue.component('product-info', {
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        };
    }
})



let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        delCart(id) {
            if (this.cart.length>0){
                this.cart.splice(this.cart.indexOf(id),1);
            }
        }
    }
})
