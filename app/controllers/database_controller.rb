class DatabaseController < ApplicationController
    $db_data_dir = File.join(Rails.root, "data", "static_viz_data")

    def overview
        paths = ['histo_test1.csv', 'histo_test2.csv']
        @ids = ['s1f', 's2f']
        @data = []
        paths.each do |path|
            p = File.join($db_data_dir, path)
            if(File.file?(p))
                current_json = {}
                File.readlines(p).each_with_index do |line, i|
                    contents = line.chomp.split(",")
                    if i == 0
                        current_json['header'] = contents
                    elsif current_json['rows']
                        current_json['rows'].push(contents)
                    else  
                        current_json['rows']= [contents]
                    end
                end
            end
            @data.push(current_json)
        end

       

        


        
    end


end
