# Plan

To build **_static_ blog website** that will be hosted on **_cloudfare_**. The **backend api will be hosted on _vercel_** which will be used to fetch the blogs **post api _once_ per day at `12:00 PM midnight` from _firebase database_** and used in a script file after being ***saved as cache to produce static blog files***.

---

## Required

The frontend will have eight main pages:

1. **Home** &rarr; `index.html`
2. **About us** &rarr; `about/index.html`
3. **Contact us** &rarr; `contact/index.html`
4. **Blogs** &rarr; `blogs/index.html`
5. **Authors** &rarr; `authors/index.html`
6. **Privacy** &rarr; `legal/privacy/index.html`
7. **Disclaimer** &rarr; `legal/disclaimer/index.html`
8. **Terms and conditions** &rarr; `legal/terms/index.html`

#### Blogs

Build staticlly through a python script.
> For example, `blogs/post/this-is-a-new-blog/index.html`
> For example, `authors/about/author-name/index.html`

#### System _(no crawling allowed)_
1. **404** &rarr; `404/index.html`
2. Any additional required pages.

### Components
1. **_Navigation_** should be built as component and loaded into files where necessary
2. **_Footer_** also need to be build separate component.
