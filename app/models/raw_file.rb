class RawFile < ApplicationRecord
    def self.read_raw_data (path)
        if File.exist?(path)
            data_file = File.open(path)
            data = data_file.read
            data_file.close
        else 
            puts '===============================>' + path
            raise 'cannot find file: ' + path
        end
        return data
    end
end
