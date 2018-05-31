import { Observable } from 'rxjs/Observable';
export class CnComponentBase {
    before(target, method, advice) {
        const original = target[method];
        target[method] = function () {
            (advice)(arguments);
            original.apply(target, arguments);
        };
        return target;
    }
    after (target, method, advice) {
        const original = target[method];
        target[method] = function () {
            original.apply(target, arguments);
            (advice)(arguments);
        };
        // target[method] = function () {
        //     const args = arguments;
        //     const pms = new Promise(function(resolver) {
        //         setTimeout(function() {
        //             original.apply(target, args);
        //             resolver('next');
        //         }, 0);
        //     });
        //     pms.then(function(result) {
        //         (advice)(args);
        //     });     
        // };
        return target;
    }
    around (target, method, advice) {
        const original = target[method];
        target[method] = function () {
            (advice)(arguments);
            original.apply(target, arguments);
            (advice)(arguments);
        };
        return target;
    }
}
