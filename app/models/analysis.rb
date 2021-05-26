class Analysis < ApplicationRecord
    
    has_many :tasks

    has_many :viz_file_objects
    has_many :analysis_user_data
    has_many :task_outputs
    belongs_to :analysis_category
    belongs_to :visualizer
    has_many :analysis_pipelines, through: :module_requirements

    def self.import(file)
        CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
          a = find_by_name(row['name'])|| new
          a.attributes = row.to_hash.slice(*column_names)
          a.files_info = JSON.parse a.files_info
          a.save!
        end
    end

    def files_info_json
      JSON.pretty_generate self.files_info
    end
end
