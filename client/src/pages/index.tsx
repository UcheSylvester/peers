import { ConferencePage } from "@/features";

export default ConferencePage

/**Steps
* 1. create a peer connection
 * 2. add tracks to peer connection
 * 3. create offer
 * 4. set local description
 * 5. send offer to server
 * 6. server sends offer to callee
 * 7. callee sets remote description
 * 8. callee creates answer
 * 9. callee sets local description
 * 10. callee sends answer to server
 * 11. server sends answer to caller
 * 12. caller sets remote description
 * 13. caller and callee exchange ice candidates
 * 14. caller and callee add ice candidates to peer connection
 * 15. caller and callee can now communicate
 * 
*/

