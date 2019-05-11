import grpc from 'grpc'
import { loadSync } from '@grpc/proto-loader'

export default {

    loadPackage(packageName: string): Indexed {
        const proto = loadSync(
            `./proto/${packageName}.proto`,
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true,
            },
        )
        return grpc.loadPackageDefinition(proto)[packageName]
    },
}
