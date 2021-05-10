---
title: Server-Side Rendering
---

To allow the usage of the library in server-side rendered applications, the library utilizes _lazy initialization_.

Document elements, like the debug interface and the scene container, are only created once they are needed, and not when immediately loading the library. This allows you to import and hook up the library's callback functions, without actually creating the elements when the server is rendering the files.

However, you can **not** call templated effects or access the `scene` object during server-side rendering.
