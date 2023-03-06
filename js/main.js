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
                <img :src="image" :alt="altText"/>
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
                <div class="cart">
                    <p>Cart({{ cart }})</p>
                </div>
                <p>Shipping: {{ shipping }}</p> 
                <div class="btns">
                    <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }"
                    >Add to cart</button>
                    <button v-on:click="deleteFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock }"
                    >Delete from cart</button>
                </div>
            </div>
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
            cart: 0
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        deleteFromCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
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
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    },
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
        premium: true
    }
})
